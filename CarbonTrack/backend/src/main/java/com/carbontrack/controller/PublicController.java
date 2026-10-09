package com.carbontrack.controller;

import com.carbontrack.dto.NgoProjectDto;
import com.carbontrack.service.NgoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@Tag(name = "Public Information", description = "Public endpoints accessible without login")
public class PublicController {

    private final NgoService ngoService;

    public PublicController(NgoService ngoService) {
        this.ngoService = ngoService;
    }

    @GetMapping("/ngo-projects")
    @Operation(summary = "Browse public NGO projects", description = "Allows visitors and users to discover climate initiatives and environmental projects without requiring authentication.")
    public ResponseEntity<List<NgoProjectDto>> getPublicProjects() {
        return ResponseEntity.ok(ngoService.getAllPublicProjects());
    }

    @GetMapping("/health")
    @Operation(summary = "Service health check", description = "Checks service operational status.")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("platform", "CarbonTrack Full-Stack Platform");
        status.put("version", "1.0.0");
        return ResponseEntity.ok(status);
    }
}
