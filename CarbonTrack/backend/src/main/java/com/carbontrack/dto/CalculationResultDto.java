package com.carbontrack.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CalculationResultDto {

    private Long id;
    private Long userId;
    private LocalDate calculationDate;
    private String period;
    private BigDecimal totalEmission; // in kg CO2e
    private BigDecimal electricityEmission;
    private BigDecimal transportEmission;
    private BigDecimal flightEmission;
    private BigDecimal foodEmission;
    private BigDecimal wasteEmission;
    private BigDecimal otherEmission;
    private String highestCategory;
    private LocalDateTime createdAt;

    private List<CalculatedActivityItemDto> breakdown = new ArrayList<>();
    private List<String> recommendations = new ArrayList<>();

    public CalculationResultDto() {
    }

    public static class CalculatedActivityItemDto {
        private String category;
        private String activityType;
        private BigDecimal quantity;
        private String unit;
        private BigDecimal emissionFactor;
        private BigDecimal emission; // kg CO2e
        private String factorSource;

        public CalculatedActivityItemDto() {
        }

        public CalculatedActivityItemDto(String category, String activityType, BigDecimal quantity,
                                         String unit, BigDecimal emissionFactor, BigDecimal emission,
                                         String factorSource) {
            this.category = category;
            this.activityType = activityType;
            this.quantity = quantity;
            this.unit = unit;
            this.emissionFactor = emissionFactor;
            this.emission = emission;
            this.factorSource = factorSource;
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

        public String getFactorSource() {
            return factorSource;
        }

        public void setFactorSource(String factorSource) {
            this.factorSource = factorSource;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getCalculationDate() {
        return calculationDate;
    }

    public void setCalculationDate(LocalDate calculationDate) {
        this.calculationDate = calculationDate;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public BigDecimal getTotalEmission() {
        return totalEmission;
    }

    public void setTotalEmission(BigDecimal totalEmission) {
        this.totalEmission = totalEmission;
    }

    public BigDecimal getElectricityEmission() {
        return electricityEmission;
    }

    public void setElectricityEmission(BigDecimal electricityEmission) {
        this.electricityEmission = electricityEmission;
    }

    public BigDecimal getTransportEmission() {
        return transportEmission;
    }

    public void setTransportEmission(BigDecimal transportEmission) {
        this.transportEmission = transportEmission;
    }

    public BigDecimal getFlightEmission() {
        return flightEmission;
    }

    public void setFlightEmission(BigDecimal flightEmission) {
        this.flightEmission = flightEmission;
    }

    public BigDecimal getFoodEmission() {
        return foodEmission;
    }

    public void setFoodEmission(BigDecimal foodEmission) {
        this.foodEmission = foodEmission;
    }

    public BigDecimal getWasteEmission() {
        return wasteEmission;
    }

    public void setWasteEmission(BigDecimal wasteEmission) {
        this.wasteEmission = wasteEmission;
    }

    public BigDecimal getOtherEmission() {
        return otherEmission;
    }

    public void setOtherEmission(BigDecimal otherEmission) {
        this.otherEmission = otherEmission;
    }

    public String getHighestCategory() {
        return highestCategory;
    }

    public void setHighestCategory(String highestCategory) {
        this.highestCategory = highestCategory;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<CalculatedActivityItemDto> getBreakdown() {
        return breakdown;
    }

    public void setBreakdown(List<CalculatedActivityItemDto> breakdown) {
        this.breakdown = breakdown;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }
}
