package com.carbontrack.controller;

import com.carbontrack.dto.EmissionFactorDto;
import com.carbontrack.service.EmissionFactorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emission-factors")
@Tag(name = "Emission Factors", description = "Verified scientific emission factor endpoints with authoritative citations")
public class EmissionFactorController {

    private final EmissionFactorService emissionFactorService;

    public EmissionFactorController(EmissionFactorService emissionFactorService) {
        this.emissionFactorService = emissionFactorService;
    }

    @GetMapping
    @Operation(summary = "List all active scientific emission factors",
               description = "Returns complete repository of verified factors with sources (CEA India, UK DESNZ, IPCC, US EPA). Optional category filter.")
    public ResponseEntity<List<EmissionFactorDto>> getAllFactors(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(emissionFactorService.getFactorsByCategory(category.trim()));
        }
        return ResponseEntity.ok(emissionFactorService.getAllActiveFactors());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get emission factor by ID", description = "Retrieves full factor documentation including source organization, URL, year, and methodology.")
    public ResponseEntity<EmissionFactorDto> getFactorById(@PathVariable Long id) {
        return ResponseEntity.ok(emissionFactorService.getFactorById(id));
    }
}
