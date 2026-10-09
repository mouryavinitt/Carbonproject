package com.carbontrack.repository;

import com.carbontrack.entity.CarbonCalculation;
import com.carbontrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarbonCalculationRepository extends JpaRepository<CarbonCalculation, Long> {
    List<CarbonCalculation> findByUserOrderByCalculationDateDesc(User user);
    List<CarbonCalculation> findByUserIdOrderByCalculationDateDesc(Long userId);
    Optional<CarbonCalculation> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT c FROM CarbonCalculation c WHERE c.user.id = :userId AND c.calculationDate >= :startDate ORDER BY c.calculationDate ASC")
    List<CarbonCalculation> findRecentByUserId(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);

    @Query("SELECT SUM(c.totalEmission) FROM CarbonCalculation c WHERE c.user.id = :userId")
    BigDecimal sumTotalEmissionByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(c.totalEmission) FROM CarbonCalculation c WHERE c.user.id = :userId AND c.calculationDate >= :startDate")
    BigDecimal sumEmissionByUserIdSince(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);
}
