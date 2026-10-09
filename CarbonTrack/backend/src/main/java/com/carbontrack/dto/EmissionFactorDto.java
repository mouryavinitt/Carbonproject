package com.carbontrack.dto;

import java.math.BigDecimal;

public class EmissionFactorDto {

    private Long id;
    private String category;
    private String activityType;
    private String unit;
    private BigDecimal factor;
    private String sourceOrganization;
    private String sourceDocument;
    private String sourceUrl;
    private String year;
    private String methodology;
    private String scope;
    private boolean active;

    public EmissionFactorDto() {
    }

    public EmissionFactorDto(Long id, String category, String activityType, String unit, BigDecimal factor,
                             String sourceOrganization, String sourceDocument, String sourceUrl,
                             String year, String methodology, String scope, boolean active) {
        this.id = id;
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
        this.active = active;
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
