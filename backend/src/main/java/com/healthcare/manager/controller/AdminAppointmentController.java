package com.healthcare.manager.controller;

import com.healthcare.manager.dto.AppointmentResponse;
import com.healthcare.manager.service.AppointmentService;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/appointments")
public class AdminAppointmentController {

    private final AppointmentService appointmentService;

    public AdminAppointmentController(
            AppointmentService appointmentService
    ) {
        this.appointmentService = appointmentService;
    }

    // =========================
    // GET APPOINTMENTS
    // =========================

    @GetMapping("/doctor/{doctorId}")
    public List<AppointmentResponse> getDoctorAppointments(
            @PathVariable Long doctorId,
            @RequestParam LocalDate date
    ) {

        return appointmentService
                .getDoctorAppointments(
                        doctorId,
                        date
                );
    }
}