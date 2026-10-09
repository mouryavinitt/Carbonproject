package com.carbontrack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "emission_activities")
public class EmissionActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "calculation_id", nullable = false)
    private CarbonCalculation calculation;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "activity_type", nullable = false, length = 100)
    private String activityType;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal quantity;

    @Column(nullable = false, length = 30)
    private String unit;

    @Column(name = "emission_factor", nullable = false, precision = 12, scale = 5)
    private BigDecimal emissionFactor;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal emission; // kg CO2e

    @Column(name = "factor_source", length = 255)
    private String factorSource;

    public EmissionActivity() {
    }

    public EmissionActivity(CarbonCalculation calculation, String category, String activityType,
                            BigDecimal quantity, String unit, BigDecimal emissionFactor,
                            BigDecimal emission, String factorSource) {
        this.calculation = calculation;
        this.category = category;
        this.activityType = activityType;
        this.quantity = quantity;
        this.unit = unit;
        this.emissionFactor = emissionFactor;
        this.emission = emission;
        this.factorSource = factorSource;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CarbonCalculation getCalculation() {
        return calculation;
    }

    public void setCalculation(CarbonCalculation calculation) {
        this.calculation = calculation;
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
