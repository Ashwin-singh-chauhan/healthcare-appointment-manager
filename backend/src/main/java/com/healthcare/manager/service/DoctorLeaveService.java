package com.healthcare.manager.service;

import com.healthcare.manager.dto.LeaveRequest;
import com.healthcare.manager.dto.LeaveResponse;
import com.healthcare.manager.entity.Doctor;
import com.healthcare.manager.entity.DoctorLeave;
import com.healthcare.manager.repository.DoctorLeaveRepository;
import com.healthcare.manager.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorLeaveService {

    private final DoctorLeaveRepository leaveRepository;
    private final DoctorRepository doctorRepository;

    public DoctorLeaveService(
            DoctorLeaveRepository leaveRepository,
            DoctorRepository doctorRepository
    ) {
        this.leaveRepository = leaveRepository;
        this.doctorRepository = doctorRepository;
    }

    public LeaveResponse createLeave(LeaveRequest request) {

        if (request.getDoctorId() == null) {
            throw new RuntimeException("Doctor is required");
        }

        if (request.getLeaveDate() == null) {
            throw new RuntimeException("Leave date is required");
        }

        Doctor doctor = doctorRepository
                .findById(request.getDoctorId())
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        if (leaveRepository.existsByDoctorIdAndLeaveDate(
                request.getDoctorId(),
                request.getLeaveDate()
        )) {
            throw new RuntimeException(
                    "Doctor already has leave on this date"
            );
        }

        DoctorLeave leave = new DoctorLeave(
                doctor,
                request.getLeaveDate(),
                request.getReason()
        );

        return toResponse(
                leaveRepository.save(leave)
        );
    }

    public List<LeaveResponse> getDoctorLeaves(
            Long doctorId
    ) {

        if (!doctorRepository.existsById(doctorId)) {
            throw new RuntimeException("Doctor not found");
        }

        return leaveRepository
                .findByDoctorIdOrderByLeaveDateAsc(doctorId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteLeave(Long id) {

        if (!leaveRepository.existsById(id)) {
            throw new RuntimeException("Leave not found");
        }

        leaveRepository.deleteById(id);
    }

    private LeaveResponse toResponse(
            DoctorLeave leave
    ) {

        return new LeaveResponse(
                leave.getId(),
                leave.getDoctor().getId(),
                leave.getLeaveDate(),
                leave.getReason()
        );
    }
        // =========================
    // CREATE LEAVE FOR LOGGED-IN DOCTOR
    // =========================

    public LeaveResponse createMyLeave(
            LeaveRequest request,
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

        return createLeave(request);
    }


    // =========================
    // GET LEAVES FOR LOGGED-IN DOCTOR
    // =========================

    public List<LeaveResponse> getMyLeaves(
            String email
    ) {

        Doctor doctor = doctorRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor profile not found"
                        )
                );

        return leaveRepository
                .findByDoctorIdOrderByLeaveDateAsc(
                        doctor.getId()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }
}