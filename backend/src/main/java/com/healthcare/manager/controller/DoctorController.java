package com.healthcare.manager.controller;

import com.healthcare.manager.entity.Doctor;
import com.healthcare.manager.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(
            DoctorRepository doctorRepository
    ) {
        this.doctorRepository = doctorRepository;
    }

    // ==========================================
    // PATIENT - ACTIVE DOCTORS ONLY
    // ==========================================

    @GetMapping
    public List<Doctor> getAllDoctors() {

        return doctorRepository.findByActiveTrue();
    }

    // ==========================================
    // GET ACTIVE DOCTOR BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctor(
            @PathVariable Long id
    ) {

        return doctorRepository.findById(id)
                .filter(Doctor::isActive)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }
    @GetMapping("/me")
    public ResponseEntity<Doctor> getMyDoctor(
            org.springframework.security.core.Authentication authentication
    ) {

        String email = authentication.getName();

        return doctorRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
