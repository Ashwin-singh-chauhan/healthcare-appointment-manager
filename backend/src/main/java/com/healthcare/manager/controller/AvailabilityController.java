package com.healthcare.manager.controller;

import com.healthcare.manager.dto.AvailabilityRequest;
import com.healthcare.manager.dto.AvailabilityResponse;
import com.healthcare.manager.service.AvailabilityService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(
            AvailabilityService availabilityService
    ) {
        this.availabilityService = availabilityService;
    }

    // =========================
    // CREATE FOR LOGGED-IN DOCTOR
    // =========================

    @PostMapping("/my")
    @ResponseStatus(HttpStatus.CREATED)
    public AvailabilityResponse createMyAvailability(
            @RequestBody AvailabilityRequest request,
            Authentication authentication
    ) {

        return availabilityService.createMyAvailability(
                request,
                authentication.getName()
        );
    }

    // =========================
    // GET MY AVAILABILITY
    // =========================

    @GetMapping("/my")
    public List<AvailabilityResponse> getMyAvailability(
            Authentication authentication
    ) {

        return availabilityService.getMyAvailability(
                authentication.getName()
        );
    }

    // =========================
    // ADMIN / GENERAL GET
    // =========================

    @GetMapping("/doctor/{doctorId}")
    public List<AvailabilityResponse> getDoctorAvailability(
            @PathVariable Long doctorId
    ) {

        return availabilityService
                .getDoctorAvailability(doctorId);
    }

    // =========================
    // CREATE BY DOCTOR ID
    // =========================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AvailabilityResponse createAvailability(
            @RequestBody AvailabilityRequest request
    ) {

        return availabilityService
                .createAvailability(request);
    }

    // =========================
    // UPDATE
    // =========================

    @PutMapping("/{id}")
    public AvailabilityResponse updateAvailability(
            @PathVariable Long id,
            @RequestBody AvailabilityRequest request
    ) {

        return availabilityService
                .updateAvailability(id, request);
    }

    // =========================
    // DELETE
    // =========================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAvailability(
            @PathVariable Long id
    ) {

        availabilityService.deleteAvailability(id);
    }
}