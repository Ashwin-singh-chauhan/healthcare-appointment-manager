package com.healthcare.manager.controller;

import com.healthcare.manager.dto.AvailabilityRequest;
import com.healthcare.manager.dto.AvailabilityResponse;
import com.healthcare.manager.service.AvailabilityService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/availability")
public class AdminAvailabilityController {

    private final AvailabilityService availabilityService;

    public AdminAvailabilityController(
            AvailabilityService availabilityService
    ) {
        this.availabilityService = availabilityService;
    }

    // =========================
    // GET AVAILABILITY
    // =========================

    @GetMapping("/doctor/{doctorId}")
    public List<AvailabilityResponse> getDoctorAvailability(
            @PathVariable Long doctorId
    ) {

        return availabilityService
                .getDoctorAvailability(doctorId);
    }

    // =========================
    // CREATE AVAILABILITY
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
    // UPDATE AVAILABILITY
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
    // DELETE AVAILABILITY
    // =========================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAvailability(
            @PathVariable Long id
    ) {

        availabilityService
                .deleteAvailability(id);
    }
}