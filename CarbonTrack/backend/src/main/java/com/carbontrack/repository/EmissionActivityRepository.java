package com.carbontrack.repository;

import com.carbontrack.entity.EmissionActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmissionActivityRepository extends JpaRepository<EmissionActivity, Long> {
    List<EmissionActivity> findByCalculationId(Long calculationId);
}
