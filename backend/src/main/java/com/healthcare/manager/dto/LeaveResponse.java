package com.healthcare.manager.dto;

import java.time.LocalDate;

public class LeaveResponse {

    private Long id;
    private Long doctorId;
    private LocalDate leaveDate;
    private String reason;

    public LeaveResponse(
            Long id,
            Long doctorId,
            LocalDate leaveDate,
            String reason
    ) {
        this.id = id;
        this.doctorId = doctorId;
        this.leaveDate = leaveDate;
        this.reason = reason;
    }

    public Long getId() {
        return id;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public LocalDate getLeaveDate() {
        return leaveDate;
    }

    public String getReason() {
        return reason;
    }
}