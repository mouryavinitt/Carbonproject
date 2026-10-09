package com.carbontrack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carbon_calculations", indexes = {
    @Index(name = "idx_calc_user_date", columnList = "user_id, calculation_date")
})
public class CarbonCalculation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "calculation_date", nullable = false)
    private LocalDate calculationDate;

    @Column(nullable = false, length = 50)
    private String period; // e.g. "Monthly (Oct 2026)", "Yearly (2026)"

    @Column(name = "total_emission", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalEmission; // in kg CO2e

    @Column(name = "electricity_emission", precision = 12, scale = 2)
    private BigDecimal electricityEmission = BigDecimal.ZERO;

    @Column(name = "transport_emission", precision = 12, scale = 2)
    private BigDecimal transportEmission = BigDecimal.ZERO;

    @Column(name = "flight_emission", precision = 12, scale = 2)
    private BigDecimal flightEmission = BigDecimal.ZERO;

    @Column(name = "food_emission", precision = 12, scale = 2)
    private BigDecimal foodEmission = BigDecimal.ZERO;

    @Column(name = "waste_emission", precision = 12, scale = 2)
    private BigDecimal wasteEmission = BigDecimal.ZERO;

    @Column(name = "other_emission", precision = 12, scale = 2)
    private BigDecimal otherEmission = BigDecimal.ZERO;

    @Column(name = "highest_category", length = 50)
    private String highestCategory;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "calculation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmissionActivity> activities = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.calculationDate == null) {
            this.calculationDate = LocalDate.now();
        }
    }

    public CarbonCalculation() {
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

    public LocalDate getCalculationDate() {
        return calculationDate;
    }

    public void setCalculationDate(LocalDate calculationDate) {
        this.calculationDate = calculationDate;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public BigDecimal getTotalEmission() {
        return totalEmission;
    }

    public void setTotalEmission(BigDecimal totalEmission) {
        this.totalEmission = totalEmission;
    }

    public BigDecimal getElectricityEmission() {
        return electricityEmission;
    }

    public void setElectricityEmission(BigDecimal electricityEmission) {
        this.electricityEmission = electricityEmission;
    }

    public BigDecimal getTransportEmission() {
        return transportEmission;
    }

    public void setTransportEmission(BigDecimal transportEmission) {
        this.transportEmission = transportEmission;
    }

    public BigDecimal getFlightEmission() {
        return flightEmission;
    }

    public void setFlightEmission(BigDecimal flightEmission) {
        this.flightEmission = flightEmission;
    }

    public BigDecimal getFoodEmission() {
        return foodEmission;
    }

    public void setFoodEmission(BigDecimal foodEmission) {
        this.foodEmission = foodEmission;
    }

    public BigDecimal getWasteEmission() {
        return wasteEmission;
    }

    public void setWasteEmission(BigDecimal wasteEmission) {
        this.wasteEmission = wasteEmission;
    }

    public BigDecimal getOtherEmission() {
        return otherEmission;
    }

    public void setOtherEmission(BigDecimal otherEmission) {
        this.otherEmission = otherEmission;
    }

    public String getHighestCategory() {
        return highestCategory;
    }

    public void setHighestCategory(String highestCategory) {
        this.highestCategory = highestCategory;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<EmissionActivity> getActivities() {
        return activities;
    }

    public void setActivities(List<EmissionActivity> activities) {
        this.activities = activities;
    }

    public void addActivity(EmissionActivity activity) {
        activities.add(activity);
        activity.setCalculation(this);
    }
}
