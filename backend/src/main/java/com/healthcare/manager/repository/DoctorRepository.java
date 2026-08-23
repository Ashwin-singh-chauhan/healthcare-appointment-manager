package com.healthcare.manager.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthcare.manager.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByEmail(String email);

    List<Doctor> findBySpecializationIgnoreCaseAndActiveTrue(
            String specialization
    );

    List<Doctor> findByActiveTrue();
}