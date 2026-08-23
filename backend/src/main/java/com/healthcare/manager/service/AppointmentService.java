package com.healthcare.manager.service;

import com.healthcare.manager.dto.AppointmentResponse;
import com.healthcare.manager.dto.BookingRequest;
import com.healthcare.manager.entity.Appointment;
import com.healthcare.manager.entity.AppointmentStatus;
import com.healthcare.manager.entity.Doctor;
import com.healthcare.manager.entity.User;
import com.healthcare.manager.exception.SlotAlreadyBookedException;
import com.healthcare.manager.repository.AppointmentRepository;
import com.healthcare.manager.repository.DoctorAvailabilityRepository;
import com.healthcare.manager.repository.DoctorLeaveRepository;
import com.healthcare.manager.repository.DoctorRepository;
import com.healthcare.manager.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final DoctorLeaveRepository doctorLeaveRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            DoctorAvailabilityRepository availabilityRepository,
            DoctorLeaveRepository doctorLeaveRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.availabilityRepository = availabilityRepository;
        this.doctorLeaveRepository = doctorLeaveRepository;
    }

    @Transactional
    public AppointmentResponse bookAppointment(
            BookingRequest request,
            String patientEmail
    ) {

        // =========================
        // FIND DOCTOR
        // =========================

        Doctor doctor = doctorRepository
                .findById(request.getDoctorId())
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        // =========================
        // FIND PATIENT
        // =========================

        User patient = userRepository
                .findByEmail(patientEmail)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found")
                );

        LocalDate date = request.getAppointmentDate();
        LocalTime time = request.getAppointmentTime();

        // =========================
        // DATE VALIDATION
        // =========================

        if (date.isBefore(LocalDate.now())) {

            throw new RuntimeException(
                    "Appointment date cannot be in the past"
            );
        }

        // =========================
        // DOCTOR LEAVE CHECK
        // =========================

        if (doctorLeaveRepository
                .existsByDoctorIdAndLeaveDate(
                        doctor.getId(),
                        date
                )) {

            throw new RuntimeException(
                    "Doctor is on leave on the selected date"
            );
        }

        // =========================
        // CHECK DOCTOR AVAILABILITY
        // =========================

        DayOfWeek day = date.getDayOfWeek();

        boolean validSlot = availabilityRepository
                .findByDoctorId(doctor.getId())
                .stream()
                .anyMatch(a -> {

                    if (a.getDayOfWeek() != day) {
                        return false;
                    }

                    if (time.isBefore(a.getStartTime())
                            || !time.isBefore(a.getEndTime())) {
                        return false;
                    }

                    long minutes = Duration.between(
                            a.getStartTime(),
                            time
                    ).toMinutes();

                    return minutes %
                            a.getSlotDurationMinutes() == 0;
                });

        if (!validSlot) {

            throw new RuntimeException(
                    "Selected time is not available"
            );
        }

        // =========================
        // CHECK EXISTING APPOINTMENT
        // =========================

        Optional<Appointment> existingAppointment =
                appointmentRepository
                        .findByDoctorIdAndAppointmentDateAndAppointmentTime(
                                doctor.getId(),
                                date,
                                time
                        );

        // =========================
        // EXISTING APPOINTMENT
        // =========================

        if (existingAppointment.isPresent()) {

            Appointment appointment =
                    existingAppointment.get();

            // Slot already booked
            if (appointment.getStatus()
                    == AppointmentStatus.BOOKED) {

                throw new SlotAlreadyBookedException(
                        "This appointment slot is already booked"
                );
            }

            // Previously cancelled → reuse it
            if (appointment.getStatus()
                    == AppointmentStatus.CANCELLED) {

                appointment.setPatient(patient);

                appointment.setStatus(
                        AppointmentStatus.BOOKED
                );

                appointment.setNotes(
                        request.getNotes()
                );

                return toResponse(
                        appointmentRepository.save(appointment)
                );
            }
        }

        // =========================
        // CREATE NEW APPOINTMENT
        // =========================

        Appointment appointment = new Appointment(
                doctor,
                patient,
                date,
                time,
                AppointmentStatus.BOOKED,
                request.getNotes()
        );

        return toResponse(
                appointmentRepository.save(appointment)
        );
    }

    // =========================
    // PATIENT APPOINTMENTS
    // =========================

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getMyAppointments(
            String email
    ) {

        User patient = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found")
                );

        return appointmentRepository
                .findByPatientIdOrderByAppointmentDateDesc(
                        patient.getId()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================
    // DOCTOR APPOINTMENTS
    // =========================

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getDoctorAppointments(
            Long doctorId,
            LocalDate date
    ) {

        return appointmentRepository
                .findByDoctorIdAndAppointmentDate(
                        doctorId,
                        date
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================
    // CANCEL APPOINTMENT
    // =========================

    @Transactional
    public void cancelAppointment(
            Long appointmentId,
            String email
    ) {

        Appointment appointment =
                appointmentRepository
                        .findById(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                )
                        );

        if (!appointment.getPatient()
                .getEmail()
                .equals(email)) {

            throw new RuntimeException(
                    "You cannot cancel this appointment"
            );
        }

        appointment.setStatus(
                AppointmentStatus.CANCELLED
        );

        appointmentRepository.save(appointment);
    }

    // =========================
    // RESPONSE MAPPING
    // =========================

    private AppointmentResponse toResponse(
            Appointment appointment
    ) {

        return new AppointmentResponse(
                appointment.getId(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getName(),
                appointment.getPatient().getId(),
                appointment.getPatient().getName(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getStatus(),
                appointment.getNotes()
        );
    }
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getMyDoctorAppointments(
            String email,
            LocalDate date
    ) {

        Doctor doctor = doctorRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        return appointmentRepository
                .findByDoctorIdAndAppointmentDate(
                        doctor.getId(),
                        date
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }
}