package com.carbontrack.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class OrganizationDashboardDto {

    private String organizationName;
    private String industry;
    private Integer employeeCount;

    private BigDecimal totalEmissions = BigDecimal.ZERO; // kg CO2e
    private BigDecimal scope1Emissions = BigDecimal.ZERO;
    private BigDecimal scope2Emissions = BigDecimal.ZERO;
    private BigDecimal scope3Emissions = BigDecimal.ZERO;

    private Map<String, BigDecimal> scopeBreakdown;
    private Map<String, BigDecimal> categoryBreakdown;
    private List<OrgMonthlyTrendDto> monthlyTrend = new ArrayList<>();
    private List<OrgEmissionItemDto> recentActivities = new ArrayList<>();

    public OrganizationDashboardDto() {
    }

    public static class OrgMonthlyTrendDto {
        private String period;
        private BigDecimal total;
        private BigDecimal scope1;
        private BigDecimal scope2;
        private BigDecimal scope3;

        public OrgMonthlyTrendDto() {
        }

        public OrgMonthlyTrendDto(String period, BigDecimal total, BigDecimal scope1, BigDecimal scope2, BigDecimal scope3) {
            this.period = period;
            this.total = total;
            this.scope1 = scope1;
            this.scope2 = scope2;
            this.scope3 = scope3;
        }

        public String getPeriod() {
            return period;
        }

        public void setPeriod(String period) {
            this.period = period;
        }

        public BigDecimal getTotal() {
            return total;
        }

        public void setTotal(BigDecimal total) {
            this.total = total;
        }

        public BigDecimal getScope1() {
            return scope1;
        }

        public void setScope1(BigDecimal scope1) {
            this.scope1 = scope1;
        }

        public BigDecimal getScope2() {
            return scope2;
        }

        public void setScope2(BigDecimal scope2) {
            this.scope2 = scope2;
        }

        public BigDecimal getScope3() {
            return scope3;
        }

        public void setScope3(BigDecimal scope3) {
            this.scope3 = scope3;
        }
    }

    public static class OrgEmissionItemDto {
        private Long id;
        private String scope;
        private String category;
        private String activityType;
        private BigDecimal quantity;
        private String unit;
        private BigDecimal emissionFactor;
        private BigDecimal emission;
        private String reportingPeriod;
        private String factorSource;

        public OrgEmissionItemDto() {
        }

        public OrgEmissionItemDto(Long id, String scope, String category, String activityType, BigDecimal quantity,
                                  String unit, BigDecimal emissionFactor, BigDecimal emission,
                                  String reportingPeriod, String factorSource) {
            this.id = id;
            this.scope = scope;
            this.category = category;
            this.activityType = activityType;
            this.quantity = quantity;
            this.unit = unit;
            this.emissionFactor = emissionFactor;
            this.emission = emission;
            this.reportingPeriod = reportingPeriod;
            this.factorSource = factorSource;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getScope() {
            return scope;
        }

        public void setScope(String scope) {
            this.scope = scope;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getActivityType() {
            return activityType;
        }

        public void setActivityType(String activityType) {
            this.activityType = activityType;
        }

        public BigDecimal getQuantity() {
            return quantity;
        }

        public void setQuantity(BigDecimal quantity) {
            this.quantity = quantity;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }

        public BigDecimal getEmissionFactor() {
            return emissionFactor;
        }

        public void setEmissionFactor(BigDecimal emissionFactor) {
            this.emissionFactor = emissionFactor;
        }

        public BigDecimal getEmission() {
            return emission;
        }

        public void setEmission(BigDecimal emission) {
            this.emission = emission;
        }

        public String getReportingPeriod() {
            return reportingPeriod;
        }

        public void setReportingPeriod(String reportingPeriod) {
            this.reportingPeriod = reportingPeriod;
        }

        public String getFactorSource() {
            return factorSource;
        }

        public void setFactorSource(String factorSource) {
            this.factorSource = factorSource;
        }
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public Integer getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(Integer employeeCount) {
        this.employeeCount = employeeCount;
    }

    public BigDecimal getTotalEmissions() {
        return totalEmissions;
    }

    public void setTotalEmissions(BigDecimal totalEmissions) {
        this.totalEmissions = totalEmissions;
    }

    public BigDecimal getScope1Emissions() {
        return scope1Emissions;
    }

    public void setScope1Emissions(BigDecimal scope1Emissions) {
        this.scope1Emissions = scope1Emissions;
    }

    public BigDecimal getScope2Emissions() {
        return scope2Emissions;
    }

    public void setScope2Emissions(BigDecimal scope2Emissions) {
        this.scope2Emissions = scope2Emissions;
    }

    public BigDecimal getScope3Emissions() {
        return scope3Emissions;
    }

    public void setScope3Emissions(BigDecimal scope3Emissions) {
        this.scope3Emissions = scope3Emissions;
    }

    public Map<String, BigDecimal> getScopeBreakdown() {
        return scopeBreakdown;
    }

    public void setScopeBreakdown(Map<String, BigDecimal> scopeBreakdown) {
        this.scopeBreakdown = scopeBreakdown;
    }

    public Map<String, BigDecimal> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, BigDecimal> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<OrgMonthlyTrendDto> getMonthlyTrend() {
        return monthlyTrend;
    }

    public void setMonthlyTrend(List<OrgMonthlyTrendDto> monthlyTrend) {
        this.monthlyTrend = monthlyTrend;
    }

    public List<OrgEmissionItemDto> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<OrgEmissionItemDto> recentActivities) {
        this.recentActivities = recentActivities;
    }
}
