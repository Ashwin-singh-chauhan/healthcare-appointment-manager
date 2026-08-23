package com.healthcare.manager.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequest {

    private Long doctorId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String notes;

    public BookingRequest() {
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public void setAppointmentTime(LocalTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}