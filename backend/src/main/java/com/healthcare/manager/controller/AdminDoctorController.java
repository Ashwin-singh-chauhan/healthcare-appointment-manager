package com.healthcare.manager.controller;

import com.healthcare.manager.entity.Doctor;
import com.healthcare.manager.repository.DoctorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/doctors")
public class AdminDoctorController {

    private final DoctorRepository doctorRepository;

    public AdminDoctorController(
            DoctorRepository doctorRepository
    ) {
        this.doctorRepository = doctorRepository;
    }

    // ==========================================
    // GET ALL DOCTORS
    // ==========================================

    @GetMapping
    public List<Doctor> getAllDoctors() {

        return doctorRepository.findAll();
    }

    // ==========================================
    // GET DOCTOR BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctor(
            @PathVariable Long id
    ) {

        return doctorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================
    // ADD DOCTOR
    // ==========================================

    @PostMapping
    public ResponseEntity<?> addDoctor(
            @RequestBody Doctor doctor
    ) {

        if (doctorRepository
                .findByEmail(doctor.getEmail())
                .isPresent()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Doctor with this email already exists");
        }

        doctor.setId(null);
        doctor.setActive(true);

        Doctor savedDoctor =
                doctorRepository.save(doctor);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedDoctor);
    }

    // ==========================================
    // UPDATE DOCTOR
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(
            @PathVariable Long id,
            @RequestBody Doctor updatedDoctor
    ) {

        return doctorRepository.findById(id)
                .map(existingDoctor -> {

                    // Check whether email is being changed
                    if (!existingDoctor
                            .getEmail()
                            .equalsIgnoreCase(
                                    updatedDoctor.getEmail()
                            )) {

                        if (doctorRepository
                                .findByEmail(
                                        updatedDoctor.getEmail()
                                )
                                .isPresent()) {

                            return ResponseEntity
                                    .status(HttpStatus.CONFLICT)
                                    .body(
                                            "Doctor with this email already exists"
                                    );
                        }
                    }

                    existingDoctor.setName(
                            updatedDoctor.getName()
                    );

                    existingDoctor.setSpecialization(
                            updatedDoctor.getSpecialization()
                    );

                    existingDoctor.setEmail(
                            updatedDoctor.getEmail()
                    );

                    existingDoctor.setPhone(
                            updatedDoctor.getPhone()
                    );

                    Doctor savedDoctor =
                            doctorRepository.save(
                                    existingDoctor
                            );

                    return ResponseEntity.ok(savedDoctor);
                })
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // ==========================================
    // ACTIVATE / DEACTIVATE DOCTOR
    // ==========================================

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateDoctorStatus(
            @PathVariable Long id,
            @RequestParam boolean active
    ) {

        return doctorRepository.findById(id)
                .map(doctor -> {

                    doctor.setActive(active);

                    Doctor savedDoctor =
                            doctorRepository.save(doctor);

                    return ResponseEntity.ok(savedDoctor);
                })
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }
}