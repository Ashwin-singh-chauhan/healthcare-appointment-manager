package com.healthcare.manager.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class AvailabilityResponse {

    private Long id;
    private Long doctorId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer slotDurationMinutes;

    public AvailabilityResponse() {
    }

    public AvailabilityResponse(
            Long id,
            Long doctorId,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            LocalTime endTime,
            Integer slotDurationMinutes
    ) {
        this.id = id;
        this.doctorId = doctorId;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.slotDurationMinutes = slotDurationMinutes;
    }

    public Long getId() {
        return id;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public Integer getSlotDurationMinutes() {
        return slotDurationMinutes;
    }
}