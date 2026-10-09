package com.carbontrack.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class PersonalCalculationRequest {

    private String period = "Current Period";

    @NotEmpty(message = "At least one emission activity must be provided")
    @Valid
    private List<ActivityInputDto> activities;

    public PersonalCalculationRequest() {
    }

    public PersonalCalculationRequest(String period, List<ActivityInputDto> activities) {
        this.period = period;
        this.activities = activities;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public List<ActivityInputDto> getActivities() {
        return activities;
    }

    public void setActivities(List<ActivityInputDto> activities) {
        this.activities = activities;
    }
}
