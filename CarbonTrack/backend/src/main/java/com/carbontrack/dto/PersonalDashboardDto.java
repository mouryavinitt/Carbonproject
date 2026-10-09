package com.carbontrack.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class PersonalDashboardDto {

    private String userName;
    private BigDecimal totalEmissionsRecorded = BigDecimal.ZERO; // kg CO2e
    private BigDecimal thisMonthEmissions = BigDecimal.ZERO;
    private BigDecimal thisYearEmissions = BigDecimal.ZERO;
    private String highestCategory = "None";
    private int totalCalculationsCount = 0;

    private Map<String, BigDecimal> categoryBreakdown; // Category -> kg CO2e
    private List<MonthlyTrendPointDto> monthlyTrend = new ArrayList<>();
    private List<String> reductionSuggestions = new ArrayList<>();
    private List<CalculationResultDto> recentCalculations = new ArrayList<>();

    public PersonalDashboardDto() {
    }

    public static class MonthlyTrendPointDto {
        private String month;
        private BigDecimal emission;

        public MonthlyTrendPointDto() {
        }

        public MonthlyTrendPointDto(String month, BigDecimal emission) {
            this.month = month;
            this.emission = emission;
        }

        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public BigDecimal getEmission() {
            return emission;
        }

        public void setEmission(BigDecimal emission) {
            this.emission = emission;
        }
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public BigDecimal getTotalEmissionsRecorded() {
        return totalEmissionsRecorded;
    }

    public void setTotalEmissionsRecorded(BigDecimal totalEmissionsRecorded) {
        this.totalEmissionsRecorded = totalEmissionsRecorded;
    }

    public BigDecimal getThisMonthEmissions() {
        return thisMonthEmissions;
    }

    public void setThisMonthEmissions(BigDecimal thisMonthEmissions) {
        this.thisMonthEmissions = thisMonthEmissions;
    }

    public BigDecimal getThisYearEmissions() {
        return thisYearEmissions;
    }

    public void setThisYearEmissions(BigDecimal thisYearEmissions) {
        this.thisYearEmissions = thisYearEmissions;
    }

    public String getHighestCategory() {
        return highestCategory;
    }

    public void setHighestCategory(String highestCategory) {
        this.highestCategory = highestCategory;
    }

    public int getTotalCalculationsCount() {
        return totalCalculationsCount;
    }

    public void setTotalCalculationsCount(int totalCalculationsCount) {
        this.totalCalculationsCount = totalCalculationsCount;
    }

    public Map<String, BigDecimal> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, BigDecimal> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<MonthlyTrendPointDto> getMonthlyTrend() {
        return monthlyTrend;
    }

    public void setMonthlyTrend(List<MonthlyTrendPointDto> monthlyTrend) {
        this.monthlyTrend = monthlyTrend;
    }

    public List<String> getReductionSuggestions() {
        return reductionSuggestions;
    }

    public void setReductionSuggestions(List<String> reductionSuggestions) {
        this.reductionSuggestions = reductionSuggestions;
    }

    public List<CalculationResultDto> getRecentCalculations() {
        return recentCalculations;
    }

    public void setRecentCalculations(List<CalculationResultDto> recentCalculations) {
        this.recentCalculations = recentCalculations;
    }
}
