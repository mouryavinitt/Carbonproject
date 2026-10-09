package com.carbontrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ngos")
public class Ngo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "ngo_name", nullable = false, length = 150)
    private String ngoName;

    @Column(length = 1000)
    private String description;

    @Column(length = 100)
    private String location;

    @Column(length = 200)
    private String website;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Ngo() {
    }

    public Ngo(User user, String ngoName, String description, String location, String website, String contactEmail) {
        this.user = user;
        this.ngoName = ngoName;
        this.description = description;
        this.location = location;
        this.website = website;
        this.contactEmail = contactEmail;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
