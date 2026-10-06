package com.example.demo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class CarbonRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String userName;

    private double electricityUnits;
    private double gasUnits;

    private double travelDistance;
    private String travelMode;

    private double electricityEmission;
    private double gasEmission;
    private double travelEmission;

    private double totalEmission;
    private String emissionRating;

    public CarbonRecord() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public double getElectricityUnits() {
        return electricityUnits;
    }

    public void setElectricityUnits(double electricityUnits) {
        this.electricityUnits = electricityUnits;
    }

    public double getGasUnits() {
        return gasUnits;
    }

    public void setGasUnits(double gasUnits) {
        this.gasUnits = gasUnits;
    }

    public double getTravelDistance() {
        return travelDistance;
    }

    public void setTravelDistance(double travelDistance) {
        this.travelDistance = travelDistance;
    }

    public String getTravelMode() {
        return travelMode;
    }

    public void setTravelMode(String travelMode) {
        this.travelMode = travelMode;
    }

    public double getElectricityEmission() {
        return electricityEmission;
    }

    public void setElectricityEmission(double electricityEmission) {
        this.electricityEmission = electricityEmission;
    }

    public double getGasEmission() {
        return gasEmission;
    }

    public void setGasEmission(double gasEmission) {
        this.gasEmission = gasEmission;
    }

    public double getTravelEmission() {
        return travelEmission;
    }

    public void setTravelEmission(double travelEmission) {
        this.travelEmission = travelEmission;
    }

    public double getTotalEmission() {
        return totalEmission;
    }

    public void setTotalEmission(double totalEmission) {
        this.totalEmission = totalEmission;
    }

    public String getEmissionRating() {
        return emissionRating;
    }

    public void setEmissionRating(String emissionRating) {
        this.emissionRating = emissionRating;
    }
}