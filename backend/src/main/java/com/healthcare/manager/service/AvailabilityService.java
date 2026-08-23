package com.healthcare.manager.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healthcare.manager.dto.AvailabilityRequest;
import com.healthcare.manager.dto.AvailabilityResponse;
import com.healthcare.manager.entity.Doctor;
import com.healthcare.manager.entity.DoctorAvailability;
import com.healthcare.manager.repository.DoctorAvailabilityRepository;
import com.healthcare.manager.repository.DoctorRepository;

@Service
public class AvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final DoctorRepository doctorRepository;

    public AvailabilityService(
            DoctorAvailabilityRepository availabilityRepository,
            DoctorRepository doctorRepository
    ) {
        this.availabilityRepository = availabilityRepository;
        this.doctorRepository = doctorRepository;
    }

    // =========================
    // CREATE
    // =========================

    @Transactional
    public AvailabilityResponse createAvailability(
            AvailabilityRequest request
    ) {

        validateRequest(request);

        Doctor doctor = doctorRepository
                .findById(request.getDoctorId())
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        DoctorAvailability availability =
                new DoctorAvailability(
                        doctor,
                        request.getDayOfWeek(),
                        request.getStartTime(),
                        request.getEndTime(),
                        request.getSlotDurationMinutes()
                );

        try {

            availability =
                    availabilityRepository.save(availability);

        } catch (Exception e) {

            throw new RuntimeException(
                    "This availability schedule already exists"
            );
        }

        return toResponse(availability);
    }

// =========================
// CREATE FOR LOGGED-IN DOCTOR
// =========================

@Transactional
public AvailabilityResponse createMyAvailability(
        AvailabilityRequest request,
        String email
) {

    Doctor doctor = doctorRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Doctor profile not found"
                    )
            );

    request.setDoctorId(doctor.getId());

    return createAvailability(request);
}


    // =========================
    // GET LOGGED-IN DOCTOR AVAILABILITY
    // =========================

    @Transactional(readOnly = true)
    public List<AvailabilityResponse> getMyAvailability(
            String email
    ) {

        Doctor doctor = doctorRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor profile not found"
                        )
                );

        return availabilityRepository
                .findByDoctorId(doctor.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }
    // =========================
    // GET BY DOCTOR
    // =========================

    @Transactional(readOnly = true)
    public List<AvailabilityResponse> getDoctorAvailability(
            Long doctorId
    ) {

        if (!doctorRepository.existsById(doctorId)) {

            throw new RuntimeException(
                    "Doctor not found"
            );
        }

        return availabilityRepository
                .findByDoctorId(doctorId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================
    // UPDATE
    // =========================

    @Transactional
    public AvailabilityResponse updateAvailability(
            Long id,
            AvailabilityRequest request
    ) {

        validateRequest(request);

        DoctorAvailability availability =
                availabilityRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Availability not found"
                                )
                        );

        Doctor doctor = doctorRepository
                .findById(request.getDoctorId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found"
                        )
                );

        availability.setDoctor(doctor);

        availability.setDayOfWeek(
                request.getDayOfWeek()
        );

        availability.setStartTime(
                request.getStartTime()
        );

        availability.setEndTime(
                request.getEndTime()
        );

        availability.setSlotDurationMinutes(
                request.getSlotDurationMinutes()
        );

        try {

            availability =
                    availabilityRepository.save(
                            availability
                    );

        } catch (Exception e) {

            throw new RuntimeException(
                    "This availability schedule already exists"
            );
        }

        return toResponse(availability);
    }

    // =========================
    // DELETE
    // =========================

    @Transactional
    public void deleteAvailability(
            Long id
    ) {

        if (!availabilityRepository.existsById(id)) {

            throw new RuntimeException(
                    "Availability not found"
            );
        }

        availabilityRepository.deleteById(id);
    }

    // =========================
    // VALIDATION
    // =========================

    private void validateRequest(
            AvailabilityRequest request
    ) {

        if (request == null) {

            throw new RuntimeException(
                    "Availability request is required"
            );
        }

        if (request.getDoctorId() == null) {

            throw new RuntimeException(
                    "Doctor is required"
            );
        }

        if (request.getDayOfWeek() == null) {

            throw new RuntimeException(
                    "Day of week is required"
            );
        }

        if (request.getStartTime() == null ||
                request.getEndTime() == null) {

            throw new RuntimeException(
                    "Start time and end time are required"
            );
        }

        if (!request.getEndTime()
                .isAfter(request.getStartTime())) {

            throw new RuntimeException(
                    "End time must be after start time"
            );
        }

        if (request.getSlotDurationMinutes() == null ||
                request.getSlotDurationMinutes() <= 0) {

            throw new RuntimeException(
                    "Slot duration must be greater than zero"
            );
        }

        long totalMinutes =
                java.time.Duration.between(
                        request.getStartTime(),
                        request.getEndTime()
                ).toMinutes();

        if (request.getSlotDurationMinutes()
                > totalMinutes) {

            throw new RuntimeException(
                    "Slot duration cannot exceed availability duration"
            );
        }
    }

    // =========================
    // RESPONSE MAPPING
    // =========================

    private AvailabilityResponse toResponse(
            DoctorAvailability availability
    ) {

        return new AvailabilityResponse(
                availability.getId(),
                availability.getDoctor().getId(),
                availability.getDayOfWeek(),
                availability.getStartTime(),
                availability.getEndTime(),
                availability.getSlotDurationMinutes()
        );
    }
}