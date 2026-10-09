package com.carbontrack.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ActivityInputDto {

    @NotBlank(message = "Category is required (e.g. Electricity, Fuel, Transport, Flights, Food, Waste)")
    private String category;

    @NotBlank(message = "Activity type is required")
    private String activityType;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Quantity must be greater than zero")
    private BigDecimal quantity;

    @NotBlank(message = "Unit is required (e.g. kWh, litre, km, day, kg)")
    private String unit;

    public ActivityInputDto() {
    }

    public ActivityInputDto(String category, String activityType, BigDecimal quantity, String unit) {
        this.category = category;
        this.activityType = activityType;
        this.quantity = quantity;
        this.unit = unit;
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
}
