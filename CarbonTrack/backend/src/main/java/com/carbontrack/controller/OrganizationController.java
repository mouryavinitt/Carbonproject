package com.carbontrack.controller;

import com.carbontrack.dto.OrganizationDashboardDto;
import com.carbontrack.dto.OrganizationEmissionRequest;
import com.carbontrack.dto.OrganizationProfileDto;
import com.carbontrack.dto.OrganizationReportDto;
import com.carbontrack.security.UserPrincipal;
import com.carbontrack.service.OrganizationService;
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
@RequestMapping("/api/organizations")
@PreAuthorize("hasRole('ORGANIZATION')")
@Tag(name = "Organization Module", description = "Scope 1, Scope 2, Scope 3 emission accounting and corporate sustainability reporting")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get organization profile", description = "Retrieves company profile, industry, location, and headcount.")
    public ResponseEntity<OrganizationProfileDto> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        OrganizationProfileDto profile = organizationService.getProfile(currentUser.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update organization profile", description = "Updates organization details.")
    public ResponseEntity<OrganizationProfileDto> updateProfile(@AuthenticationPrincipal UserPrincipal currentUser,
                                                               @RequestBody OrganizationProfileDto dto) {
        OrganizationProfileDto updated = organizationService.updateProfile(currentUser.getId(), dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/emissions")
    @Operation(summary = "Record Scope 1/2/3 activity emission",
               description = "Applies verified scientific emission factors for Scope 1 (Direct), Scope 2 (Purchased Energy), or Scope 3 (Indirect Value Chain).")
    public ResponseEntity<OrganizationDashboardDto.OrgEmissionItemDto> recordEmission(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody OrganizationEmissionRequest request) {
        OrganizationDashboardDto.OrgEmissionItemDto result = organizationService.recordEmission(currentUser.getId(), request);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/emissions")
    @Operation(summary = "List recorded emissions", description = "Retrieves logged activities with optional reporting period filter.")
    public ResponseEntity<List<OrganizationDashboardDto.OrgEmissionItemDto>> getEmissions(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) String period) {
        List<OrganizationDashboardDto.OrgEmissionItemDto> list = organizationService.getEmissions(currentUser.getId(), period);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get organization dashboard", description = "Retrieves total footprint, Scope 1/2/3 breakdown, trends, and recent activities.")
    public ResponseEntity<OrganizationDashboardDto> getDashboard(@AuthenticationPrincipal UserPrincipal currentUser) {
        OrganizationDashboardDto dashboard = organizationService.getDashboard(currentUser.getId());
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/reports")
    @Operation(summary = "Generate organizational emissions report", description = "Returns structured report data for monthly or yearly reporting periods with scope breakdown percentages.")
    public ResponseEntity<OrganizationReportDto> getReport(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false, defaultValue = "ALL") String period) {
        OrganizationReportDto report = organizationService.generateReport(currentUser.getId(), period);
        return ResponseEntity.ok(report);
    }
}
