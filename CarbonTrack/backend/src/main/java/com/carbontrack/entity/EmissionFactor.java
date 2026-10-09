package com.carbontrack.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(name = "emission_factors", indexes = {
    @Index(name = "idx_ef_category", columnList = "category"),
    @Index(name = "idx_ef_activity", columnList = "activity_type")
})
public class EmissionFactor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "activity_type", nullable = false, length = 100)
    private String activityType;

    @Column(nullable = false, length = 30)
    private String unit;

    @Column(nullable = false, precision = 12, scale = 5)
    private BigDecimal factor;

    @Column(name = "source_organization", nullable = false, length = 150)
    private String sourceOrganization;

    @Column(name = "source_document", nullable = false, length = 255)
    private String sourceDocument;

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(name = "emission_year")
    private String year;

    @Column(length = 1000)
    private String methodology;

    @Column(length = 20)
    private String scope;

    @Column(nullable = false)
    private boolean active = true;

    public EmissionFactor() {
    }

    public EmissionFactor(String category, String activityType, String unit, BigDecimal factor,
                          String sourceOrganization, String sourceDocument, String sourceUrl,
                          String year, String methodology, String scope) {
        this.category = category;
        this.activityType = activityType;
        this.unit = unit;
        this.factor = factor;
        this.sourceOrganization = sourceOrganization;
        this.sourceDocument = sourceDocument;
        this.sourceUrl = sourceUrl;
        this.year = year;
        this.methodology = methodology;
        this.scope = scope;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getFactor() {
        return factor;
    }

    public void setFactor(BigDecimal factor) {
        this.factor = factor;
    }

    public String getSourceOrganization() {
        return sourceOrganization;
    }

    public void setSourceOrganization(String sourceOrganization) {
        this.sourceOrganization = sourceOrganization;
    }

    public String getSourceDocument() {
        return sourceDocument;
    }

    public void setSourceDocument(String sourceDocument) {
        this.sourceDocument = sourceDocument;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getMethodology() {
        return methodology;
    }

    public void setMethodology(String methodology) {
        this.methodology = methodology;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
