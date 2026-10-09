package com.carbontrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class NgoProjectDto {

    private Long id;
    private Long ngoId;
    private String ngoName;

    @NotBlank(message = "Project title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
    private String description;

    @NotBlank(message = "Goals are required")
    @Size(min = 5, max = 1000, message = "Goals must be between 5 and 1000 characters")
    private String goals;

    @NotBlank(message = "Estimated impact is required (e.g. 1,200 tonnes CO2e sequestered)")
    private String estimatedImpact;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Contact information is required")
    private String contactInformation;

    private String website;
    private LocalDateTime createdAt;

    public NgoProjectDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNgoId() {
        return ngoId;
    }

    public void setNgoId(Long ngoId) {
        this.ngoId = ngoId;
    }

    public String getNgoName() {
        return ngoName;
    }

    public void setNgoName(String ngoName) {
        this.ngoName = ngoName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGoals() {
        return goals;
    }

    public void setGoals(String goals) {
        this.goals = goals;
    }

    public String getEstimatedImpact() {
        return estimatedImpact;
    }

    public void setEstimatedImpact(String estimatedImpact) {
        this.estimatedImpact = estimatedImpact;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getContactInformation() {
        return contactInformation;
    }

    public void setContactInformation(String contactInformation) {
        this.contactInformation = contactInformation;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
