package com.carbontrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "carbon_reduction_projects")
public class CarbonReductionProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ngo_id", nullable = false)
    private Ngo ngo;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false, length = 1000)
    private String goals;

    @Column(name = "estimated_impact", nullable = false, length = 255)
    private String estimatedImpact; // e.g. "500 tonnes CO2e sequestered annually"

    @Column(nullable = false, length = 150)
    private String location;

    @Column(name = "contact_information", nullable = false, length = 255)
    private String contactInformation;

    @Column(length = 255)
    private String website;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public CarbonReductionProject() {
    }

    public CarbonReductionProject(Ngo ngo, String title, String description, String goals,
                                  String estimatedImpact, String location, String contactInformation, String website) {
        this.ngo = ngo;
        this.title = title;
        this.description = description;
        this.goals = goals;
        this.estimatedImpact = estimatedImpact;
        this.location = location;
        this.contactInformation = contactInformation;
        this.website = website;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ngo getNgo() {
        return ngo;
    }

    public void setNgo(Ngo ngo) {
        this.ngo = ngo;
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
