package com.carbontrack.controller;

import com.carbontrack.dto.CalculationResultDto;
import com.carbontrack.dto.PersonalCalculationRequest;
import com.carbontrack.dto.PersonalDashboardDto;
import com.carbontrack.dto.PersonalProfileDto;
import com.carbontrack.security.UserPrincipal;
import com.carbontrack.service.PersonalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personal")
@Tag(name = "Personal Module", description = "Personal profile, footprint calculations, history, and dashboard")
public class PersonalController {

    private final PersonalService personalService;

    public PersonalController(PersonalService personalService) {
        this.personalService = personalService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get personal profile", description = "Retrieves profile settings for the authenticated personal user.")
    public ResponseEntity<PersonalProfileDto> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        PersonalProfileDto profile = personalService.getProfile(currentUser.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update personal profile", description = "Updates profile details such as name, location, occupation, and bio.")
    public ResponseEntity<PersonalProfileDto> updateProfile(@AuthenticationPrincipal UserPrincipal currentUser,
                                                           @RequestBody PersonalProfileDto dto) {
        PersonalProfileDto updated = personalService.updateProfile(currentUser.getId(), dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/calculations")
    @Operation(summary = "Calculate and save personal carbon footprint",
               description = "Computes emissions using verified scientific factors (Emissions = Activity Data * Emission Factor), persists record to MySQL, and returns breakdown.")
    public ResponseEntity<CalculationResultDto> saveCalculation(@AuthenticationPrincipal UserPrincipal currentUser,
                                                                @Valid @RequestBody PersonalCalculationRequest request) {
        CalculationResultDto result = personalService.saveCalculation(currentUser.getId(), request);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/calculations")
    @Operation(summary = "Get calculation history", description = "Lists past calculations with optional year/month filters.")
    public ResponseEntity<List<CalculationResultDto>> getHistory(@AuthenticationPrincipal UserPrincipal currentUser,
                                                                 @RequestParam(required = false) String year,
                                                                 @RequestParam(required = false) String month) {
        List<CalculationResultDto> history = personalService.getHistory(currentUser.getId(), year, month);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/calculations/{id}")
    @Operation(summary = "Get single calculation by ID", description = "Retrieves full breakdown of a single calculation. Enforces user ownership.")
    public ResponseEntity<CalculationResultDto> getCalculationById(@AuthenticationPrincipal UserPrincipal currentUser,
                                                                   @PathVariable Long id) {
        CalculationResultDto result = personalService.getCalculationById(currentUser.getId(), id);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/calculations/{id}")
    @Operation(summary = "Delete calculation", description = "Deletes a previously saved calculation by ID.")
    public ResponseEntity<Void> deleteCalculation(@AuthenticationPrincipal UserPrincipal currentUser,
                                                  @PathVariable Long id) {
        personalService.deleteCalculation(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get personal dashboard", description = "Calculates monthly/yearly totals, category distribution, 6-month trends, and dynamic reduction suggestions.")
    public ResponseEntity<PersonalDashboardDto> getDashboard(@AuthenticationPrincipal UserPrincipal currentUser) {
        PersonalDashboardDto dashboard = personalService.getDashboard(currentUser.getId());
        return ResponseEntity.ok(dashboard);
    }
}
