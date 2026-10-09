package com.carbontrack;

import com.carbontrack.dto.OrganizationDashboardDto;
import com.carbontrack.dto.OrganizationEmissionRequest;
import com.carbontrack.entity.EmissionFactor;
import com.carbontrack.entity.Organization;
import com.carbontrack.entity.OrganizationEmission;
import com.carbontrack.entity.User;
import com.carbontrack.repository.EmissionFactorRepository;
import com.carbontrack.repository.OrganizationEmissionRepository;
import com.carbontrack.repository.OrganizationRepository;
import com.carbontrack.repository.UserRepository;
import com.carbontrack.service.OrganizationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class OrganizationScopeTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private OrganizationEmissionRepository emissionRepository;

    @Mock
    private EmissionFactorRepository emissionFactorRepository;

    @InjectMocks
    private OrganizationService organizationService;

    private Organization organization;
    private EmissionFactor dieselFactor;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setId(5L);

        organization = new Organization();
        organization.setId(10L);
        organization.setUser(user);
        organization.setOrganizationName("EcoTech Solutions");

        dieselFactor = new EmissionFactor(
                "Fuel",
                "Diesel",
                "litre",
                new BigDecimal("2.51233"),
                "UK DESNZ",
                "GHG Factors 2023",
                "https://gov.uk",
                "2023",
                "Stationary combustion",
                "Scope 1"
        );
    }

    @Test
    @DisplayName("Should correctly record Scope 1 direct emissions")
    void testRecordScope1Emission() {
        when(organizationRepository.findByUserId(5L)).thenReturn(Optional.of(organization));
        when(emissionFactorRepository.findByActivityTypeAndActiveTrue("Diesel"))
                .thenReturn(Optional.of(dieselFactor));

        OrganizationEmission savedMock = new OrganizationEmission(
                organization, "Scope 1", "Fuel", "Diesel",
                new BigDecimal("200"), "litre", new BigDecimal("2.51233"),
                new BigDecimal("502.47"), "Q3 2026", "UK DESNZ"
        );
        savedMock.setId(101L);

        when(emissionRepository.save(any(OrganizationEmission.class))).thenReturn(savedMock);

        OrganizationEmissionRequest request = new OrganizationEmissionRequest(
                "Scope 1", "Fuel", "Diesel", new BigDecimal("200"), "litre", "Q3 2026"
        );

        OrganizationDashboardDto.OrgEmissionItemDto result = organizationService.recordEmission(5L, request);

        assertNotNull(result);
        assertEquals("Scope 1", result.getScope());
        assertEquals("Diesel", result.getActivityType());
        assertEquals(new BigDecimal("502.47"), result.getEmission());
    }
}
