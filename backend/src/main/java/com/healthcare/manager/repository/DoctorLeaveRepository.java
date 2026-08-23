package com.healthcare.manager.repository;

import com.healthcare.manager.entity.DoctorLeave;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DoctorLeaveRepository
        extends JpaRepository<DoctorLeave, Long> {

    List<DoctorLeave> findByDoctorIdOrderByLeaveDateAsc(
            Long doctorId
    );

    Optional<DoctorLeave> findByDoctorIdAndLeaveDate(
            Long doctorId,
            LocalDate leaveDate
    );

    boolean existsByDoctorIdAndLeaveDate(
            Long doctorId,
            LocalDate leaveDate
    );
}