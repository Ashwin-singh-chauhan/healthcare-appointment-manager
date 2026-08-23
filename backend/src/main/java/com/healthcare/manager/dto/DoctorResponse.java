package com.healthcare.manager.dto;

public class DoctorResponse {

    private Long id;
    private String name;
    private String specialization;
    private String email;
    private String phone;
    private boolean active;

    public DoctorResponse() {
    }

    public DoctorResponse(
            Long id,
            String name,
            String specialization,
            String email,
            String phone,
            boolean active
    ) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.email = email;
        this.phone = phone;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public boolean isActive() {
        return active;
    }
}