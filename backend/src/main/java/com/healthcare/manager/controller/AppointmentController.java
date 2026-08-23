package com.healthcare.manager.controller;

import com.healthcare.manager.dto.AppointmentResponse;
import com.healthcare.manager.dto.BookingRequest;
import com.healthcare.manager.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService
    ) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse book(
            @RequestBody BookingRequest request,
            Authentication authentication
    ) {

        return appointmentService.bookAppointment(
                request,
                authentication.getName()
        );
    }

    @GetMapping("/my")
    public List<AppointmentResponse> myAppointments(
            Authentication authentication
    ) {

        return appointmentService.getMyAppointments(
                authentication.getName()
        );
    }

    @GetMapping("/doctor/{doctorId}")
    public List<AppointmentResponse> doctorAppointments(
            @PathVariable Long doctorId,
            @RequestParam
            @org.springframework.format.annotation.DateTimeFormat(
                    iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE
            )
            LocalDate date
    ) {

        return appointmentService.getDoctorAppointments(
                doctorId,
                date
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(
            @PathVariable Long id,
            Authentication authentication
    ) {

        appointmentService.cancelAppointment(
                id,
                authentication.getName()
        );
    }
    @GetMapping("/doctor/my")
    public List<AppointmentResponse> myDoctorAppointments(
            @RequestParam LocalDate date,
            Authentication authentication
    ) {

        return appointmentService.getMyDoctorAppointments(
                authentication.getName(),
                date
        );
    }
}