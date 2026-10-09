package com.carbontrack.repository;

import com.carbontrack.entity.CarbonReductionProject;
import com.carbontrack.entity.Ngo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarbonReductionProjectRepository extends JpaRepository<CarbonReductionProject, Long> {
    List<CarbonReductionProject> findByNgoOrderByCreatedAtDesc(Ngo ngo);
    List<CarbonReductionProject> findByNgoIdOrderByCreatedAtDesc(Long ngoId);
    Optional<CarbonReductionProject> findByIdAndNgoId(Long id, Long ngoId);
    List<CarbonReductionProject> findAllByOrderByCreatedAtDesc();
}
