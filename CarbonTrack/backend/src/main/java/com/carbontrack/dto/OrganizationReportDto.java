package com.carbontrack.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class OrganizationReportDto {

    private String organizationName;
    private String reportingPeriod;
    private String generatedAt;
    private BigDecimal totalEmissions;
    private BigDecimal scope1Total;
    private BigDecimal scope2Total;
    private BigDecimal scope3Total;
    private Map<String, BigDecimal> scopePercentages;
    private Map<String, BigDecimal> categoryBreakdown;
    private List<OrganizationDashboardDto.OrgEmissionItemDto> activities;

    public OrganizationReportDto() {
    }

    public OrganizationReportDto(String organizationName, String reportingPeriod, String generatedAt,
                                 BigDecimal totalEmissions, BigDecimal scope1Total, BigDecimal scope2Total,
                                 BigDecimal scope3Total, Map<String, BigDecimal> scopePercentages,
                                 Map<String, BigDecimal> categoryBreakdown,
                                 List<OrganizationDashboardDto.OrgEmissionItemDto> activities) {
        this.organizationName = organizationName;
        this.reportingPeriod = reportingPeriod;
        this.generatedAt = generatedAt;
        this.totalEmissions = totalEmissions;
        this.scope1Total = scope1Total;
        this.scope2Total = scope2Total;
        this.scope3Total = scope3Total;
        this.scopePercentages = scopePercentages;
        this.categoryBreakdown = categoryBreakdown;
        this.activities = activities;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getReportingPeriod() {
        return reportingPeriod;
    }

    public void setReportingPeriod(String reportingPeriod) {
        this.reportingPeriod = reportingPeriod;
    }

    public String getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(String generatedAt) {
        this.generatedAt = generatedAt;
    }

    public BigDecimal getTotalEmissions() {
        return totalEmissions;
    }

    public void setTotalEmissions(BigDecimal totalEmissions) {
        this.totalEmissions = totalEmissions;
    }

    public BigDecimal getScope1Total() {
        return scope1Total;
    }

    public void setScope1Total(BigDecimal scope1Total) {
        this.scope1Total = scope1Total;
    }

    public BigDecimal getScope2Total() {
        return scope2Total;
    }

    public void setScope2Total(BigDecimal scope2Total) {
        this.scope2Total = scope2Total;
    }

    public BigDecimal getScope3Total() {
        return scope3Total;
    }

    public void setScope3Total(BigDecimal scope3Total) {
        this.scope3Total = scope3Total;
    }

    public Map<String, BigDecimal> getScopePercentages() {
        return scopePercentages;
    }

    public void setScopePercentages(Map<String, BigDecimal> scopePercentages) {
        this.scopePercentages = scopePercentages;
    }

    public Map<String, BigDecimal> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, BigDecimal> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<OrganizationDashboardDto.OrgEmissionItemDto> getActivities() {
        return activities;
    }

    public void setActivities(List<OrganizationDashboardDto.OrgEmissionItemDto> activities) {
        this.activities = activities;
    }
}
