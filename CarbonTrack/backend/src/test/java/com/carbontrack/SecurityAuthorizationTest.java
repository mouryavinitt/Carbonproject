package com.carbontrack;

import com.carbontrack.entity.CarbonCalculation;
import com.carbontrack.entity.User;
import com.carbontrack.exception.UnauthorizedAccessException;
import com.carbontrack.repository.CarbonCalculationRepository;
import com.carbontrack.service.PersonalService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SecurityAuthorizationTest {

    @Mock
    private CarbonCalculationRepository calculationRepository;

    @InjectMocks
    private PersonalService personalService;

    @Test
    @DisplayName("Should prevent user from accessing another user's calculation records")
    void testPreventCrossUserAccess() {
        Long authenticatedUserId = 100L;
        Long otherUserId = 200L;
        Long targetCalculationId = 42L;

        User otherUser = new User();
        otherUser.setId(otherUserId);

        CarbonCalculation calculation = new CarbonCalculation();
        calculation.setId(targetCalculationId);
        calculation.setUser(otherUser);

        when(calculationRepository.findById(targetCalculationId)).thenReturn(Optional.of(calculation));

        // Authenticated user 100 should not be allowed to read user 200's record
        assertThrows(UnauthorizedAccessException.class, () -> {
            personalService.getCalculationById(authenticatedUserId, targetCalculationId);
        });
    }

    @Test
    @DisplayName("Should prevent user from deleting another user's calculation records")
    void testPreventCrossUserDeletion() {
        Long authenticatedUserId = 100L;
        Long otherUserId = 200L;
        Long targetCalculationId = 42L;

        User otherUser = new User();
        otherUser.setId(otherUserId);

        CarbonCalculation calculation = new CarbonCalculation();
        calculation.setId(targetCalculationId);
        calculation.setUser(otherUser);

        when(calculationRepository.findById(targetCalculationId)).thenReturn(Optional.of(calculation));

        assertThrows(UnauthorizedAccessException.class, () -> {
            personalService.deleteCalculation(authenticatedUserId, targetCalculationId);
        });
    }
}
