package com.carbontrack.dto;

import java.time.LocalDateTime;

public class NgoProfileDto {
    private Long id;
    private Long userId;
    private String ngoName;
    private String description;
    private String location;
    private String website;
    private String contactEmail;
    private LocalDateTime createdAt;

    public NgoProfileDto() {
    }

    public NgoProfileDto(Long id, Long userId, String ngoName, String description, String location, String website, String contactEmail, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.ngoName = ngoName;
        this.description = description;
        this.location = location;
        this.website = website;
        this.contactEmail = contactEmail;
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

    public String getNgoName() {
        return ngoName;
    }

    public void setNgoName(String ngoName) {
        this.ngoName = ngoName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String location() {
        return location;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
