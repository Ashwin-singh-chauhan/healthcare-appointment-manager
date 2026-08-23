package com.healthcare.manager.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "doctor_leaves",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "doctor_id",
                                "leave_date"
                        }
                )
        }
)
public class DoctorLeave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "leave_date", nullable = false)
    private LocalDate leaveDate;

    @Column(length = 500)
    private String reason;

    public DoctorLeave() {
    }

    public DoctorLeave(
            Doctor doctor,
            LocalDate leaveDate,
            String reason
    ) {
        this.doctor = doctor;
        this.leaveDate = leaveDate;
        this.reason = reason;
    }

    public Long getId() {
        return id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public LocalDate getLeaveDate() {
        return leaveDate;
    }

    public String getReason() {
        return reason;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public void setLeaveDate(LocalDate leaveDate) {
        this.leaveDate = leaveDate;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}