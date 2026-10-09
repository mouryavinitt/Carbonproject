package com.carbontrack.service;

import com.carbontrack.dto.ActivityInputDto;
import com.carbontrack.dto.CalculationResultDto;
import com.carbontrack.entity.EmissionActivity;
import com.carbontrack.entity.EmissionFactor;
import com.carbontrack.exception.BadRequestException;
import com.carbontrack.exception.ResourceNotFoundException;
import com.carbontrack.repository.EmissionFactorRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class CarbonCalculationEngine {

    private final EmissionFactorRepository emissionFactorRepository;

    public CarbonCalculationEngine(EmissionFactorRepository emissionFactorRepository) {
        this.emissionFactorRepository = emissionFactorRepository;
    }

    public static class ComputedCalculation {
        public BigDecimal totalEmission = BigDecimal.ZERO;
        public BigDecimal electricityEmission = BigDecimal.ZERO;
        public BigDecimal transportEmission = BigDecimal.ZERO;
        public BigDecimal flightEmission = BigDecimal.ZERO;
        public BigDecimal foodEmission = BigDecimal.ZERO;
        public BigDecimal wasteEmission = BigDecimal.ZERO;
        public BigDecimal otherEmission = BigDecimal.ZERO;
        public String highestCategory = "None";
        public List<EmissionActivity> activities = new ArrayList<>();
        public List<CalculationResultDto.CalculatedActivityItemDto> breakdown = new ArrayList<>();
        public List<String> recommendations = new ArrayList<>();
    }

    public ComputedCalculation computePersonalEmissions(List<ActivityInputDto> inputs) {
        if (inputs == null || inputs.isEmpty()) {
            throw new BadRequestException("At least one activity input is required to compute emissions.");
        }

        ComputedCalculation result = new ComputedCalculation();
        Map<String, BigDecimal> categoryTotals = new HashMap<>();

        for (ActivityInputDto input : inputs) {
            if (input.getQuantity() == null || input.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Quantity for activity '" + input.getActivityType() + "' must be positive.");
            }

            // Look up verified emission factor by activity type
            EmissionFactor factor = emissionFactorRepository
                    .findByActivityTypeAndActiveTrue(input.getActivityType())
                    .orElseGet(() -> emissionFactorRepository
                            .findFirstByCategoryAndActivityTypeAndActiveTrue(input.getCategory(), input.getActivityType())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "No verified scientific emission factor registered for activity: '"
                                            + input.getActivityType() + "'. Calculation cannot proceed with unverified factors.")));

            // Unit validation check
            if (!factor.getUnit().equalsIgnoreCase(input.getUnit().trim())) {
                throw new BadRequestException("Unit mismatch for '" + input.getActivityType() + "': expected verified unit '"
                        + factor.getUnit() + "', but received '" + input.getUnit() + "'.");
            }

            // Real calculation: Emissions = Activity Data * Emission Factor
            BigDecimal computedEmission = input.getQuantity().multiply(factor.getFactor())
                    .setScale(2, RoundingMode.HALF_UP);

            result.totalEmission = result.totalEmission.add(computedEmission);

            // Accumulate by category
            String normalizedCategory = normalizeCategory(factor.getCategory());
            categoryTotals.put(normalizedCategory, categoryTotals.getOrDefault(normalizedCategory, BigDecimal.ZERO).add(computedEmission));

            switch (normalizedCategory) {
                case "Electricity":
                    result.electricityEmission = result.electricityEmission.add(computedEmission);
                    break;
                case "Fuel":
                case "Transport":
                    result.transportEmission = result.transportEmission.add(computedEmission);
                    break;
                case "Flights":
                    result.flightEmission = result.flightEmission.add(computedEmission);
                    break;
                case "Food":
                    result.foodEmission = result.foodEmission.add(computedEmission);
                    break;
                case "Waste":
                    result.wasteEmission = result.wasteEmission.add(computedEmission);
                    break;
                default:
                    result.otherEmission = result.otherEmission.add(computedEmission);
                    break;
            }

            // Build activity record
            EmissionActivity activity = new EmissionActivity();
            activity.setCategory(factor.getCategory());
            activity.setActivityType(factor.getActivityType());
            activity.setQuantity(input.getQuantity());
            activity.setUnit(factor.getUnit());
            activity.setEmissionFactor(factor.getFactor());
            activity.setEmission(computedEmission);
            activity.setFactorSource(factor.getSourceOrganization() + " (" + factor.getYear() + ")");
            result.activities.add(activity);

            result.breakdown.add(new CalculationResultDto.CalculatedActivityItemDto(
                    factor.getCategory(),
                    factor.getActivityType(),
                    input.getQuantity(),
                    factor.getUnit(),
                    factor.getFactor(),
                    computedEmission,
                    factor.getSourceOrganization() + " - " + factor.getSourceDocument()
            ));
        }

        // Determine highest category
        String highestCat = "None";
        BigDecimal maxEmission = BigDecimal.ZERO;
        for (Map.Entry<String, BigDecimal> entry : categoryTotals.entrySet()) {
            if (entry.getValue().compareTo(maxEmission) > 0) {
                maxEmission = entry.getValue();
                highestCat = entry.getKey();
            }
        }
        result.highestCategory = highestCat;

        // Generate tailored reduction recommendations
        result.recommendations = generateRecommendations(result.highestCategory, categoryTotals, result.totalEmission);

        return result;
    }

    private String normalizeCategory(String category) {
        if (category == null) return "Other";
        String lower = category.toLowerCase().trim();
        if (lower.contains("electric") || lower.contains("power")) return "Electricity";
        if (lower.contains("fuel") || lower.contains("petrol") || lower.contains("diesel")) return "Fuel";
        if (lower.contains("transport") || lower.contains("travel") || lower.contains("bus") || lower.contains("train")) return "Transport";
        if (lower.contains("flight") || lower.contains("aviation") || lower.contains("air")) return "Flights";
        if (lower.contains("food") || lower.contains("diet")) return "Food";
        if (lower.contains("waste") || lower.contains("recycle") || lower.contains("compost")) return "Waste";
        return category;
    }

    public List<String> generateRecommendations(String highestCategory, Map<String, BigDecimal> categoryTotals, BigDecimal totalEmission) {
        List<String> list = new ArrayList<>();

        if ("Electricity".equalsIgnoreCase(highestCategory)) {
            list.add("Electricity is currently your largest recorded source of emissions. Consider switching to BEE 5-star energy-efficient appliances, LED lighting, or rooftop solar to reduce grid power draw.");
            list.add("Phantom load reduction: Unplug idle chargers and entertainment equipment on standby to save up to 10% on domestic electricity consumption.");
        } else if ("Transport".equalsIgnoreCase(highestCategory) || "Fuel".equalsIgnoreCase(highestCategory)) {
            list.add("Transport contributes significantly to your footprint. Consider replacing solo car trips with metro, local buses, carpooling, or electric two-wheelers.");
            list.add("For journeys under 3 km, walking or bicycling produces zero direct carbon emissions.");
        } else if ("Flights".equalsIgnoreCase(highestCategory)) {
            list.add("Aviation has the highest carbon intensity per passenger-kilometer due to radiative forcing. For domestic trips under 600 km, opting for high-speed or express rail saves up to 80% emissions.");
            list.add("Consolidate multiple short business trips into virtual meetings or single itinerary trips where practical.");
        } else if ("Food".equalsIgnoreCase(highestCategory)) {
            list.add("Food and lifestyle emissions represent your primary footprint. Adopting a flexitarian diet (reducing high-impact red meat and dairy by 2-3 days a week) can reduce dietary emissions by up to 35%.");
            list.add("Minimize domestic food waste by planned meal prep, as unconsumed food in landfill generates potent methane emissions.");
        } else if ("Waste".equalsIgnoreCase(highestCategory)) {
            list.add("Waste management is your top category. Segregating kitchen organic waste for local composting reduces landfill methane production by over 90%.");
            list.add("Prioritize reusable packaging and ensure dry recyclables (paper, PET, aluminium) are routed to verified recycling streams.");
        } else {
            list.add("Track your recurring energy and travel habits regularly to identify gradual reduction opportunities.");
        }

        if (totalEmission.compareTo(new BigDecimal("500")) > 0) {
            list.add("Your recorded footprint exceeds the regional monthly median benchmark. Prioritizing efficiency in your top two categories will yield immediate impact.");
        }

        return list;
    }
}
