package com.healthcare.manager.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthcare.manager.entity.Appointment;
import com.healthcare.manager.entity.AppointmentStatus;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatus(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime appointmentTime,
            AppointmentStatus status
    );

    Optional<Appointment> findByDoctorIdAndAppointmentDateAndAppointmentTime(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime appointmentTime
    );

    List<Appointment> findByPatientIdOrderByAppointmentDateDesc(
            Long patientId
    );

    List<Appointment> findByDoctorIdAndAppointmentDate(
            Long doctorId,
            LocalDate appointmentDate
    );
}