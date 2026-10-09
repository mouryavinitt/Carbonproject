package com.carbontrack.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class OrganizationEmissionRequest {

    @NotBlank(message = "Scope is required (Scope 1, Scope 2, or Scope 3)")
    private String scope;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Activity type is required")
    private String activityType;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Quantity must be greater than zero")
    private BigDecimal quantity;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotBlank(message = "Reporting period is required (e.g. Q3 2026, 2026-M10)")
    private String reportingPeriod;

    public OrganizationEmissionRequest() {
    }

    public OrganizationEmissionRequest(String scope, String category, String activityType, BigDecimal quantity, String unit, String reportingPeriod) {
        this.scope = scope;
        this.category = category;
        this.activityType = activityType;
        this.quantity = quantity;
        this.unit = unit;
        this.reportingPeriod = reportingPeriod;
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

    public String getReportingPeriod() {
        return reportingPeriod;
    }

    public void setReportingPeriod(String reportingPeriod) {
        this.reportingPeriod = reportingPeriod;
    }
}
