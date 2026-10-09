package com.carbontrack.controller;

import com.carbontrack.dto.NgoProfileDto;
import com.carbontrack.dto.NgoProjectDto;
import com.carbontrack.security.UserPrincipal;
import com.carbontrack.service.NgoService;
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
@RequestMapping("/api/ngos")
@PreAuthorize("hasRole('NGO')")
@Tag(name = "NGO Module", description = "NGO profile and environmental project management")
public class NgoController {

    private final NgoService ngoService;

    public NgoController(NgoService ngoService) {
        this.ngoService = ngoService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get NGO profile", description = "Retrieves profile settings for authenticated NGO.")
    public ResponseEntity<NgoProfileDto> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        NgoProfileDto profile = ngoService.getProfile(currentUser.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update NGO profile", description = "Updates NGO details, description, website, and location.")
    public ResponseEntity<NgoProfileDto> updateProfile(@AuthenticationPrincipal UserPrincipal currentUser,
                                                      @RequestBody NgoProfileDto dto) {
        NgoProfileDto updated = ngoService.updateProfile(currentUser.getId(), dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/projects")
    @Operation(summary = "Create carbon reduction project", description = "Publishes a new environmental initiative or restoration project.")
    public ResponseEntity<NgoProjectDto> createProject(@AuthenticationPrincipal UserPrincipal currentUser,
                                                       @Valid @RequestBody NgoProjectDto dto) {
        NgoProjectDto created = ngoService.createProject(currentUser.getId(), dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/projects")
    @Operation(summary = "List NGO's own projects", description = "Retrieves all projects created by this authenticated NGO.")
    public ResponseEntity<List<NgoProjectDto>> getMyProjects(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<NgoProjectDto> projects = ngoService.getMyProjects(currentUser.getId());
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/projects/{id}")
    @Operation(summary = "Get single project by ID", description = "Retrieves project details. Validates NGO ownership.")
    public ResponseEntity<NgoProjectDto> getProjectById(@AuthenticationPrincipal UserPrincipal currentUser,
                                                        @PathVariable Long id) {
        NgoProjectDto project = ngoService.getProjectById(currentUser.getId(), id);
        return ResponseEntity.ok(project);
    }

    @PutMapping("/projects/{id}")
    @Operation(summary = "Update project", description = "Modifies project title, goals, or estimated carbon impact.")
    public ResponseEntity<NgoProjectDto> updateProject(@AuthenticationPrincipal UserPrincipal currentUser,
                                                       @PathVariable Long id,
                                                       @Valid @RequestBody NgoProjectDto dto) {
        NgoProjectDto updated = ngoService.updateProject(currentUser.getId(), id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/projects/{id}")
    @Operation(summary = "Delete project", description = "Deletes an existing project owned by the NGO.")
    public ResponseEntity<Void> deleteProject(@AuthenticationPrincipal UserPrincipal currentUser,
                                              @PathVariable Long id) {
        ngoService.deleteProject(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
