package com.carbontrack.repository;

import com.carbontrack.entity.Organization;
import com.carbontrack.entity.OrganizationEmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrganizationEmissionRepository extends JpaRepository<OrganizationEmission, Long> {
    List<OrganizationEmission> findByOrganizationOrderByLoggedAtDesc(Organization organization);
    List<OrganizationEmission> findByOrganizationIdOrderByLoggedAtDesc(Long organizationId);
    List<OrganizationEmission> findByOrganizationIdAndReportingPeriod(Long organizationId, String reportingPeriod);

    @Query("SELECT SUM(e.emission) FROM OrganizationEmission e WHERE e.organization.id = :orgId")
    BigDecimal sumTotalEmissionByOrganizationId(@Param("orgId") Long orgId);

    @Query("SELECT SUM(e.emission) FROM OrganizationEmission e WHERE e.organization.id = :orgId AND e.scope = :scope")
    BigDecimal sumEmissionByOrgAndScope(@Param("orgId") Long orgId, @Param("scope") String scope);

    @Query("SELECT e.scope, SUM(e.emission) FROM OrganizationEmission e WHERE e.organization.id = :orgId GROUP BY e.scope")
    List<Object[]> sumEmissionsGroupedByScope(@Param("orgId") Long orgId);

    @Query("SELECT e.category, SUM(e.emission) FROM OrganizationEmission e WHERE e.organization.id = :orgId GROUP BY e.category")
    List<Object[]> sumEmissionsGroupedByCategory(@Param("orgId") Long orgId);
}
