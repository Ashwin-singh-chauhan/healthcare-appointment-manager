package com.healthcare.manager.controller;

import com.healthcare.manager.dto.LeaveRequest;
import com.healthcare.manager.dto.LeaveResponse;
import com.healthcare.manager.service.DoctorLeaveService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor/leaves")
public class DoctorLeaveController {

    private final DoctorLeaveService leaveService;

    public DoctorLeaveController(
            DoctorLeaveService leaveService
    ) {
        this.leaveService = leaveService;
    }

    // =========================
    // CREATE MY LEAVE
    // =========================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LeaveResponse createLeave(
            @RequestBody LeaveRequest request,
            Authentication authentication
    ) {

        return leaveService.createMyLeave(
                request,
                authentication.getName()
        );
    }

    // =========================
    // GET MY LEAVES
    // =========================

    @GetMapping
    public List<LeaveResponse> getMyLeaves(
            Authentication authentication
    ) {

        return leaveService.getMyLeaves(
                authentication.getName()
        );
    }

    // =========================
    // DELETE LEAVE
    // =========================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLeave(
            @PathVariable Long id
    ) {

        leaveService.deleteLeave(id);
    }
}