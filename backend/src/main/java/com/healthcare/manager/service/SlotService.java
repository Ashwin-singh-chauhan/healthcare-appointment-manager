package com.healthcare.manager.service;

import com.healthcare.manager.dto.SlotResponse;
import com.healthcare.manager.entity.AppointmentStatus;
import com.healthcare.manager.entity.DoctorAvailability;
import com.healthcare.manager.repository.AppointmentRepository;
import com.healthcare.manager.repository.DoctorAvailabilityRepository;
import com.healthcare.manager.repository.DoctorLeaveRepository;
import com.healthcare.manager.repository.DoctorRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SlotService {

    private final DoctorRepository doctorRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorLeaveRepository doctorLeaveRepository;

    public SlotService(
            DoctorRepository doctorRepository,
            DoctorAvailabilityRepository availabilityRepository,
            AppointmentRepository appointmentRepository,
            DoctorLeaveRepository doctorLeaveRepository
    ) {
        this.doctorRepository = doctorRepository;
        this.availabilityRepository = availabilityRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorLeaveRepository = doctorLeaveRepository;
    }

    public List<SlotResponse> getAvailableSlots(
            Long doctorId,
            LocalDate date
    ) {

        if (!doctorRepository.existsById(doctorId)) {
            throw new RuntimeException("Doctor not found");
        }

        /*
         * If the doctor is on leave on this date,
         * there are no available slots.
         */
        if (doctorLeaveRepository
                .existsByDoctorIdAndLeaveDate(
                        doctorId,
                        date
                )) {

            return new ArrayList<>();
        }

        List<DoctorAvailability> availabilityList =
                availabilityRepository.findByDoctorId(doctorId);

        List<SlotResponse> slots = new ArrayList<>();

        for (DoctorAvailability availability : availabilityList) {

            /*
             * Only use availability matching
             * the selected day of the week.
             */
            if (availability.getDayOfWeek()
                    != date.getDayOfWeek()) {
                continue;
            }

            LocalTime current =
                    availability.getStartTime();

            LocalTime end =
                    availability.getEndTime();

            int duration =
                    availability.getSlotDurationMinutes();

            while (current.isBefore(end)) {

                LocalTime slotTime = current;

                boolean booked =
                        appointmentRepository
                                .existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatus(
                                        doctorId,
                                        date,
                                        slotTime,
                                        AppointmentStatus.BOOKED
                                );

                /*
                 * Only show slots that are not booked.
                 */
                if (!booked) {

                    slots.add(
                            new SlotResponse(
                                    slotTime,
                                    true
                            )
                    );
                }

                current = current.plusMinutes(duration);
            }
        }

        return slots;
    }
}