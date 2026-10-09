package com.carbontrack.service;

import com.carbontrack.dto.OrganizationDashboardDto;
import com.carbontrack.dto.OrganizationEmissionRequest;
import com.carbontrack.dto.OrganizationProfileDto;
import com.carbontrack.dto.OrganizationReportDto;
import com.carbontrack.entity.EmissionFactor;
import com.carbontrack.entity.Organization;
import com.carbontrack.entity.OrganizationEmission;
import com.carbontrack.entity.User;
import com.carbontrack.exception.BadRequestException;
import com.carbontrack.exception.ResourceNotFoundException;
import com.carbontrack.repository.EmissionFactorRepository;
import com.carbontrack.repository.OrganizationEmissionRepository;
import com.carbontrack.repository.OrganizationRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrganizationService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationEmissionRepository emissionRepository;
    private final EmissionFactorRepository emissionFactorRepository;

    public OrganizationService(UserRepository userRepository,
                               OrganizationRepository organizationRepository,
                               OrganizationEmissionRepository emissionRepository,
                               EmissionFactorRepository emissionFactorRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.emissionRepository = emissionRepository;
        this.emissionFactorRepository = emissionFactorRepository;
    }

    @Transactional(readOnly = true)
    public OrganizationProfileDto getProfile(Long userId) {
        Organization org = getOrgByUserId(userId);
        return new OrganizationProfileDto(
                org.getId(),
                org.getUser().getId(),
                org.getOrganizationName(),
                org.getIndustry(),
                org.getLocation(),
                org.getEmployeeCount(),
                org.getCreatedAt()
        );
    }

    @Transactional
    public OrganizationProfileDto updateProfile(Long userId, OrganizationProfileDto dto) {
        Organization org = getOrgByUserId(userId);
        if (dto.getOrganizationName() != null && !dto.getOrganizationName().isBlank()) {
            org.setOrganizationName(dto.getOrganizationName().trim());
        }
        if (dto.getIndustry() != null) {
            org.setIndustry(dto.getIndustry().trim());
        }
        if (dto.getLocation() != null) {
            org.setLocation(dto.getLocation().trim());
        }
        if (dto.getEmployeeCount() != null && dto.getEmployeeCount() > 0) {
            org.setEmployeeCount(dto.getEmployeeCount());
        }

        Organization saved = organizationRepository.save(org);
        return new OrganizationProfileDto(
                saved.getId(),
                saved.getUser().getId(),
                saved.getOrganizationName(),
                saved.getIndustry(),
                saved.getLocation(),
                saved.getEmployeeCount(),
                saved.getCreatedAt()
        );
    }

    @Transactional
    public OrganizationDashboardDto.OrgEmissionItemDto recordEmission(Long userId, OrganizationEmissionRequest request) {
        Organization org = getOrgByUserId(userId);

        // Normalize Scope (Scope 1, Scope 2, Scope 3)
        String scope = request.getScope().trim();
        if (!scope.equalsIgnoreCase("Scope 1") && !scope.equalsIgnoreCase("Scope 2") && !scope.equalsIgnoreCase("Scope 3")) {
            throw new BadRequestException("Invalid GHG scope: '" + scope + "'. Allowed scopes are 'Scope 1', 'Scope 2', 'Scope 3'.");
        }

        // Fetch verified emission factor
        EmissionFactor factor = emissionFactorRepository
                .findByActivityTypeAndActiveTrue(request.getActivityType().trim())
                .orElseGet(() -> emissionFactorRepository
                        .findFirstByCategoryAndActivityTypeAndActiveTrue(request.getCategory().trim(), request.getActivityType().trim())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "No verified scientific emission factor found for activity '" + request.getActivityType() + "'.")));

        // Unit verification
        if (!factor.getUnit().equalsIgnoreCase(request.getUnit().trim())) {
            throw new BadRequestException("Unit mismatch for '" + request.getActivityType() + "': expected verified unit '"
                    + factor.getUnit() + "', received '" + request.getUnit() + "'.");
        }

        BigDecimal calculated = request.getQuantity().multiply(factor.getFactor()).setScale(2, RoundingMode.HALF_UP);

        OrganizationEmission emission = new OrganizationEmission();
        emission.setOrganization(org);
        emission.setScope(scope);
        emission.setCategory(factor.getCategory());
        emission.setActivityType(factor.getActivityType());
        emission.setQuantity(request.getQuantity());
        emission.setUnit(factor.getUnit());
        emission.setEmissionFactor(factor.getFactor());
        emission.setEmission(calculated);
        emission.setReportingPeriod(request.getReportingPeriod().trim());
        emission.setFactorSource(factor.getSourceOrganization() + " (" + factor.getYear() + ") - " + factor.getSourceDocument());

        OrganizationEmission saved = emissionRepository.save(emission);

        return new OrganizationDashboardDto.OrgEmissionItemDto(
                saved.getId(),
                saved.getScope(),
                saved.getCategory(),
                saved.getActivityType(),
                saved.getQuantity(),
                saved.getUnit(),
                saved.getEmissionFactor(),
                saved.getEmission(),
                saved.getReportingPeriod(),
                saved.getFactorSource()
        );
    }

    @Transactional(readOnly = true)
    public List<OrganizationDashboardDto.OrgEmissionItemDto> getEmissions(Long userId, String period) {
        Organization org = getOrgByUserId(userId);
        List<OrganizationEmission> list;

        if (period != null && !period.isBlank()) {
            list = emissionRepository.findByOrganizationIdAndReportingPeriod(org.getId(), period.trim());
        } else {
            list = emissionRepository.findByOrganizationOrderByLoggedAtDesc(org);
        }

        return list.stream().map(e -> new OrganizationDashboardDto.OrgEmissionItemDto(
                e.getId(),
                e.getScope(),
                e.getCategory(),
                e.getActivityType(),
                e.getQuantity(),
                e.getUnit(),
                e.getEmissionFactor(),
                e.getEmission(),
                e.getReportingPeriod(),
                e.getFactorSource()
        )).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrganizationDashboardDto getDashboard(Long userId) {
        Organization org = getOrgByUserId(userId);
        OrganizationDashboardDto dto = new OrganizationDashboardDto();
        dto.setOrganizationName(org.getOrganizationName());
        dto.setIndustry(org.getIndustry());
        dto.setEmployeeCount(org.getEmployeeCount());

        List<OrganizationEmission> emissions = emissionRepository.findByOrganizationOrderByLoggedAtDesc(org);

        if (emissions.isEmpty()) {
            dto.setScopeBreakdown(Map.of("Scope 1", BigDecimal.ZERO, "Scope 2", BigDecimal.ZERO, "Scope 3", BigDecimal.ZERO));
            dto.setCategoryBreakdown(Collections.emptyMap());
            return dto;
        }

        BigDecimal scope1 = BigDecimal.ZERO;
        BigDecimal scope2 = BigDecimal.ZERO;
        BigDecimal scope3 = BigDecimal.ZERO;
        Map<String, BigDecimal> catMap = new LinkedHashMap<>();
        Map<String, BigDecimal[]> periodMap = new LinkedHashMap<>(); // Period -> [Total, S1, S2, S3]

        for (OrganizationEmission e : emissions) {
            BigDecimal val = e.getEmission();
            if ("Scope 1".equalsIgnoreCase(e.getScope())) {
                scope1 = scope1.add(val);
            } else if ("Scope 2".equalsIgnoreCase(e.getScope())) {
                scope2 = scope2.add(val);
            } else {
                scope3 = scope3.add(val);
            }

            catMap.put(e.getCategory(), catMap.getOrDefault(e.getCategory(), BigDecimal.ZERO).add(val));

            String p = e.getReportingPeriod();
            periodMap.putIfAbsent(p, new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO});
            BigDecimal[] arr = periodMap.get(p);
            arr[0] = arr[0].add(val);
            if ("Scope 1".equalsIgnoreCase(e.getScope())) arr[1] = arr[1].add(val);
            else if ("Scope 2".equalsIgnoreCase(e.getScope())) arr[2] = arr[2].add(val);
            else arr[3] = arr[3].add(val);
        }

        BigDecimal total = scope1.add(scope2).add(scope3);
        dto.setTotalEmissions(total);
        dto.setScope1Emissions(scope1);
        dto.setScope2Emissions(scope2);
        dto.setScope3Emissions(scope3);

        Map<String, BigDecimal> scopeBreakdown = new LinkedHashMap<>();
        scopeBreakdown.put("Scope 1", scope1);
        scopeBreakdown.put("Scope 2", scope2);
        scopeBreakdown.put("Scope 3", scope3);
        dto.setScopeBreakdown(scopeBreakdown);

        dto.setCategoryBreakdown(catMap);

        List<OrganizationDashboardDto.OrgMonthlyTrendDto> trend = new ArrayList<>();
        for (Map.Entry<String, BigDecimal[]> entry : periodMap.entrySet()) {
            trend.add(new OrganizationDashboardDto.OrgMonthlyTrendDto(
                    entry.getKey(),
                    entry.getValue()[0],
                    entry.getValue()[1],
                    entry.getValue()[2],
                    entry.getValue()[3]
            ));
        }
        dto.setMonthlyTrend(trend);

        dto.setRecentActivities(emissions.stream().limit(10).map(e -> new OrganizationDashboardDto.OrgEmissionItemDto(
                e.getId(),
                e.getScope(),
                e.getCategory(),
                e.getActivityType(),
                e.getQuantity(),
                e.getUnit(),
                e.getEmissionFactor(),
                e.getEmission(),
                e.getReportingPeriod(),
                e.getFactorSource()
        )).collect(Collectors.toList()));

        return dto;
    }

    @Transactional(readOnly = true)
    public OrganizationReportDto generateReport(Long userId, String period) {
        Organization org = getOrgByUserId(userId);
        List<OrganizationEmission> list;

        if (period != null && !period.isBlank() && !period.equalsIgnoreCase("ALL")) {
            list = emissionRepository.findByOrganizationIdAndReportingPeriod(org.getId(), period.trim());
        } else {
            list = emissionRepository.findByOrganizationOrderByLoggedAtDesc(org);
            period = "Complete History";
        }

        BigDecimal s1 = BigDecimal.ZERO;
        BigDecimal s2 = BigDecimal.ZERO;
        BigDecimal s3 = BigDecimal.ZERO;
        Map<String, BigDecimal> catMap = new LinkedHashMap<>();

        List<OrganizationDashboardDto.OrgEmissionItemDto> items = new ArrayList<>();
        for (OrganizationEmission e : list) {
            BigDecimal val = e.getEmission();
            if ("Scope 1".equalsIgnoreCase(e.getScope())) s1 = s1.add(val);
            else if ("Scope 2".equalsIgnoreCase(e.getScope())) s2 = s2.add(val);
            else s3 = s3.add(val);

            catMap.put(e.getCategory(), catMap.getOrDefault(e.getCategory(), BigDecimal.ZERO).add(val));

            items.add(new OrganizationDashboardDto.OrgEmissionItemDto(
                    e.getId(), e.getScope(), e.getCategory(), e.getActivityType(),
                    e.getQuantity(), e.getUnit(), e.getEmissionFactor(), e.getEmission(),
                    e.getReportingPeriod(), e.getFactorSource()
            ));
        }

        BigDecimal total = s1.add(s2).add(s3);
        Map<String, BigDecimal> scopePct = new LinkedHashMap<>();
        if (total.compareTo(BigDecimal.ZERO) > 0) {
            scopePct.put("Scope 1", s1.multiply(new BigDecimal("100")).divide(total, 1, RoundingMode.HALF_UP));
            scopePct.put("Scope 2", s2.multiply(new BigDecimal("100")).divide(total, 1, RoundingMode.HALF_UP));
            scopePct.put("Scope 3", s3.multiply(new BigDecimal("100")).divide(total, 1, RoundingMode.HALF_UP));
        } else {
            scopePct.put("Scope 1", BigDecimal.ZERO);
            scopePct.put("Scope 2", BigDecimal.ZERO);
            scopePct.put("Scope 3", BigDecimal.ZERO);
        }

        return new OrganizationReportDto(
                org.getOrganizationName(),
                period,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                total,
                s1,
                s2,
                s3,
                scopePct,
                catMap,
                items
        );
    }

    private Organization getOrgByUserId(Long userId) {
        return organizationRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
                    Organization newOrg = new Organization(user, user.getName() + " Corp", "General", "Unspecified", 20);
                    return organizationRepository.save(newOrg);
                });
    }
}
