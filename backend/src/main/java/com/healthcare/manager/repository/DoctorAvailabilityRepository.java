package com.healthcare.manager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthcare.manager.entity.DoctorAvailability;

public interface DoctorAvailabilityRepository
        extends JpaRepository<DoctorAvailability, Long> {

    List<DoctorAvailability> findByDoctorId(Long doctorId);
}