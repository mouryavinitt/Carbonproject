package com.carbontrack;

import com.carbontrack.dto.ActivityInputDto;
import com.carbontrack.entity.EmissionFactor;
import com.carbontrack.exception.BadRequestException;
import com.carbontrack.exception.ResourceNotFoundException;
import com.carbontrack.repository.EmissionFactorRepository;
import com.carbontrack.service.CarbonCalculationEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CalculationEngineTest {

    @Mock
    private EmissionFactorRepository emissionFactorRepository;

    @InjectMocks
    private CarbonCalculationEngine calculationEngine;

    private EmissionFactor electricityFactor;
    private EmissionFactor petrolFactor;

    @BeforeEach
    void setUp() {
        electricityFactor = new EmissionFactor(
                "Electricity",
                "Grid Electricity (India Average)",
                "kWh",
                new BigDecimal("0.71600"),
                "CEA India",
                "CO2 Baseline Database Ver 19",
                "https://cea.nic.in",
                "2023",
                "Weighted average grid intensity",
                "Scope 2"
        );

        petrolFactor = new EmissionFactor(
                "Fuel",
                "Petrol / Gasoline",
                "litre",
                new BigDecimal("2.31495"),
                "UK DESNZ",
                "GHG Factors 2023",
                "https://gov.uk",
                "2023",
                "Direct combustion",
                "Scope 1"
        );
    }

    @Test
    @DisplayName("Should accurately calculate emissions using Activity * Factor")
    void testAccurateCalculation() {
        when(emissionFactorRepository.findByActivityTypeAndActiveTrue("Grid Electricity (India Average)"))
                .thenReturn(Optional.of(electricityFactor));
        when(emissionFactorRepository.findByActivityTypeAndActiveTrue("Petrol / Gasoline"))
                .thenReturn(Optional.of(petrolFactor));

        ActivityInputDto elecInput = new ActivityInputDto("Electricity", "Grid Electricity (India Average)", new BigDecimal("100"), "kWh");
        ActivityInputDto petrolInput = new ActivityInputDto("Fuel", "Petrol / Gasoline", new BigDecimal("20"), "litre");

        CarbonCalculationEngine.ComputedCalculation result =
                calculationEngine.computePersonalEmissions(List.of(elecInput, petrolInput));

        // 100 * 0.716 = 71.60 kg CO2e
        // 20 * 2.31495 = 46.30 kg CO2e
        // Total = 117.90 kg CO2e
        assertNotNull(result);
        assertEquals(new BigDecimal("117.90"), result.totalEmission);
        assertEquals(new BigDecimal("71.60"), result.electricityEmission);
        assertEquals(new BigDecimal("46.30"), result.transportEmission);
        assertEquals("Electricity", result.highestCategory);
        assertFalse(result.recommendations.isEmpty());
    }

    @Test
    @DisplayName("Should reject negative or zero activity quantities")
    void testRejectNegativeQuantities() {
        ActivityInputDto invalidInput = new ActivityInputDto("Electricity", "Grid Electricity (India Average)", new BigDecimal("-50"), "kWh");

        assertThrows(BadRequestException.class, () -> {
            calculationEngine.computePersonalEmissions(List.of(invalidInput));
        });
    }

    @Test
    @DisplayName("Should reject mismatched measurement units")
    void testRejectUnitMismatch() {
        when(emissionFactorRepository.findByActivityTypeAndActiveTrue("Grid Electricity (India Average)"))
                .thenReturn(Optional.of(electricityFactor));

        ActivityInputDto mismatchInput = new ActivityInputDto("Electricity", "Grid Electricity (India Average)", new BigDecimal("100"), "litre");

        assertThrows(BadRequestException.class, () -> {
            calculationEngine.computePersonalEmissions(List.of(mismatchInput));
        });
    }

    @Test
    @DisplayName("Should fail when activity has no scientific authoritative factor")
    void testFailOnUnverifiedActivity() {
        when(emissionFactorRepository.findByActivityTypeAndActiveTrue("Unknown Space Fuel"))
                .thenReturn(Optional.empty());
        when(emissionFactorRepository.findFirstByCategoryAndActivityTypeAndActiveTrue("Custom", "Unknown Space Fuel"))
                .thenReturn(Optional.empty());

        ActivityInputDto unverifiedInput = new ActivityInputDto("Custom", "Unknown Space Fuel", new BigDecimal("10"), "kg");

        assertThrows(ResourceNotFoundException.class, () -> {
            calculationEngine.computePersonalEmissions(List.of(unverifiedInput));
        });
    }
}
