package com.healthcare.manager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.healthcare.manager.dto.DoctorResponse;
import com.healthcare.manager.entity.Doctor;
import com.healthcare.manager.repository.DoctorRepository;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<DoctorResponse> getAllDoctors() {

        return doctorRepository.findByActiveTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<DoctorResponse> getDoctorsBySpecialization(
            String specialization
    ) {

        return doctorRepository
                .findBySpecializationIgnoreCaseAndActiveTrue(
                        specialization
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DoctorResponse getDoctorById(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        return toResponse(doctor);
    }

    private DoctorResponse toResponse(Doctor doctor) {

        return new DoctorResponse(
                doctor.getId(),
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getEmail(),
                doctor.getPhone(),
                doctor.isActive()
        );
    }
}