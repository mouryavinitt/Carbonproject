package com.carbontrack.dto;

import java.time.LocalDateTime;

public class OrganizationProfileDto {
    private Long id;
    private Long userId;
    private String organizationName;
    private String industry;
    private String location;
    private Integer employeeCount;
    private LocalDateTime createdAt;

    public OrganizationProfileDto() {
    }

    public OrganizationProfileDto(Long id, Long userId, String organizationName, String industry, String location, Integer employeeCount, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.organizationName = organizationName;
        this.industry = industry;
        this.location = location;
        this.employeeCount = employeeCount;
        this.createdAt = createdAt;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(Integer employeeCount) {
        this.employeeCount = employeeCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
