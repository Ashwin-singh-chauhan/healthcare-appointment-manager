package com.healthcare.manager.dto;

import com.healthcare.manager.entity.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentResponse {

    private Long id;
    private Long doctorId;
    private String doctorName;
    private Long patientId;
    private String patientName;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private AppointmentStatus status;
    private String notes;

    public AppointmentResponse() {
    }

    public AppointmentResponse(
            Long id,
            Long doctorId,
            String doctorName,
            Long patientId,
            String patientName,
            LocalDate appointmentDate,
            LocalTime appointmentTime,
            AppointmentStatus status,
            String notes
    ) {
        this.id = id;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.patientId = patientId;
        this.patientName = patientName;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public Long getPatientId() {
        return patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }
}