package com.healthcare.manager.controller;

import com.healthcare.manager.dto.AppointmentResponse;
import com.healthcare.manager.entity.Doctor;
import com.healthcare.manager.repository.DoctorRepository;
import com.healthcare.manager.service.AppointmentService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctor")
public class DoctorDashboardController {

    private final DoctorRepository doctorRepository;
    private final AppointmentService appointmentService;

    public DoctorDashboardController(
            DoctorRepository doctorRepository,
            AppointmentService appointmentService
    ) {
        this.doctorRepository = doctorRepository;
        this.appointmentService = appointmentService;
    }

    // =========================
    // LOGGED-IN DOCTOR
    // =========================

    @GetMapping("/profile")
    public Doctor getProfile(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return doctorRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor profile not found"
                        )
                );
    }

    // =========================
    // DOCTOR APPOINTMENTS
    // =========================

    @GetMapping("/appointments")
    public List<AppointmentResponse> getAppointments(
            @RequestParam LocalDate date,
            Authentication authentication
    ) {

        String email = authentication.getName();

        Doctor doctor = doctorRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor profile not found"
                        )
                );

        return appointmentService
                .getDoctorAppointments(
                        doctor.getId(),
                        date
                );
    }
}