package com.carbontrack.repository;

import com.carbontrack.entity.EmissionFactor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmissionFactorRepository extends JpaRepository<EmissionFactor, Long> {
    List<EmissionFactor> findByActiveTrue();
    List<EmissionFactor> findByCategoryAndActiveTrue(String category);
    Optional<EmissionFactor> findByActivityTypeAndActiveTrue(String activityType);
    Optional<EmissionFactor> findFirstByCategoryAndActivityTypeAndActiveTrue(String category, String activityType);
}
