package com.carbontrack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "organization_emissions", indexes = {
    @Index(name = "idx_org_emiss_scope", columnList = "organization_id, scope")
})
public class OrganizationEmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(nullable = false, length = 20)
    private String scope; // "Scope 1", "Scope 2", "Scope 3"

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
    private BigDecimal emission; // in kg CO2e

    @Column(name = "reporting_period", nullable = false, length = 50)
    private String reportingPeriod;

    @Column(name = "factor_source", length = 255)
    private String factorSource;

    @Column(name = "logged_at", nullable = false, updatable = false)
    private LocalDateTime loggedAt;

    @PrePersist
    protected void onCreate() {
        this.loggedAt = LocalDateTime.now();
    }

    public OrganizationEmission() {
    }

    public OrganizationEmission(Organization organization, String scope, String category, String activityType,
                                BigDecimal quantity, String unit, BigDecimal emissionFactor,
                                BigDecimal emission, String reportingPeriod, String factorSource) {
        this.organization = organization;
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

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
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

    public LocalDateTime getLoggedAt() {
        return loggedAt;
    }

    public void setLoggedAt(LocalDateTime loggedAt) {
        this.loggedAt = loggedAt;
    }
}
