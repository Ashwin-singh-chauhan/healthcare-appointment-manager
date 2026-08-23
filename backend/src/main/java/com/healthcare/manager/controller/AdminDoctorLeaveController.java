package com.healthcare.manager.controller;

import com.healthcare.manager.dto.LeaveRequest;
import com.healthcare.manager.dto.LeaveResponse;
import com.healthcare.manager.service.DoctorLeaveService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/leaves")
public class AdminDoctorLeaveController {

    private final DoctorLeaveService doctorLeaveService;

    public AdminDoctorLeaveController(
            DoctorLeaveService doctorLeaveService
    ) {
        this.doctorLeaveService = doctorLeaveService;
    }

    // =========================
    // GET DOCTOR LEAVES
    // =========================

    @GetMapping("/doctor/{doctorId}")
    public List<LeaveResponse> getDoctorLeaves(
            @PathVariable Long doctorId
    ) {

        return doctorLeaveService
                .getDoctorLeaves(doctorId);
    }

    // =========================
    // CREATE LEAVE
    // =========================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LeaveResponse createLeave(
            @RequestBody LeaveRequest request
    ) {

        return doctorLeaveService
                .createLeave(request);
    }

    // =========================
    // DELETE LEAVE
    // =========================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLeave(
            @PathVariable Long id
    ) {

        doctorLeaveService
                .deleteLeave(id);
    }
}