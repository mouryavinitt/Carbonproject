package com.carbontrack.service;

import com.carbontrack.dto.NgoProfileDto;
import com.carbontrack.dto.NgoProjectDto;
import com.carbontrack.entity.CarbonReductionProject;
import com.carbontrack.entity.Ngo;
import com.carbontrack.entity.User;
import com.carbontrack.exception.ResourceNotFoundException;
import com.carbontrack.exception.UnauthorizedAccessException;
import com.carbontrack.repository.CarbonReductionProjectRepository;
import com.carbontrack.repository.NgoRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NgoService {

    private final UserRepository userRepository;
    private final NgoRepository ngoRepository;
    private final CarbonReductionProjectRepository projectRepository;

    public NgoService(UserRepository userRepository,
                      NgoRepository ngoRepository,
                      CarbonReductionProjectRepository projectRepository) {
        this.userRepository = userRepository;
        this.ngoRepository = ngoRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public NgoProfileDto getProfile(Long userId) {
        Ngo ngo = getNgoByUserId(userId);
        return new NgoProfileDto(
                ngo.getId(),
                ngo.getUser().getId(),
                ngo.getNgoName(),
                ngo.getDescription(),
                ngo.getLocation(),
                ngo.getWebsite(),
                ngo.getContactEmail(),
                ngo.getCreatedAt()
        );
    }

    @Transactional
    public NgoProfileDto updateProfile(Long userId, NgoProfileDto dto) {
        Ngo ngo = getNgoByUserId(userId);
        if (dto.getNgoName() != null && !dto.getNgoName().isBlank()) {
            ngo.setNgoName(dto.getNgoName().trim());
        }
        if (dto.getDescription() != null) {
            ngo.setDescription(dto.getDescription().trim());
        }
        if (dto.getLocation() != null) {
            ngo.setLocation(dto.getLocation().trim());
        }
        if (dto.getWebsite() != null) {
            ngo.setWebsite(dto.getWebsite().trim());
        }
        if (dto.getContactEmail() != null) {
            ngo.setContactEmail(dto.getContactEmail().trim());
        }

        Ngo saved = ngoRepository.save(ngo);
        return new NgoProfileDto(
                saved.getId(),
                saved.getUser().getId(),
                saved.getNgoName(),
                saved.getDescription(),
                saved.getLocation(),
                saved.getWebsite(),
                saved.getContactEmail(),
                saved.getCreatedAt()
        );
    }

    @Transactional
    public NgoProjectDto createProject(Long userId, NgoProjectDto dto) {
        Ngo ngo = getNgoByUserId(userId);

        CarbonReductionProject project = new CarbonReductionProject();
        project.setNgo(ngo);
        project.setTitle(dto.getTitle().trim());
        project.setDescription(dto.getDescription().trim());
        project.setGoals(dto.getGoals().trim());
        project.setEstimatedImpact(dto.getEstimatedImpact().trim());
        project.setLocation(dto.getLocation().trim());
        project.setContactInformation(dto.getContactInformation().trim());
        project.setWebsite(dto.getWebsite());

        CarbonReductionProject saved = projectRepository.save(project);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<NgoProjectDto> getMyProjects(Long userId) {
        Ngo ngo = getNgoByUserId(userId);
        return projectRepository.findByNgoOrderByCreatedAtDesc(ngo)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NgoProjectDto getProjectById(Long userId, Long projectId) {
        Ngo ngo = getNgoByUserId(userId);
        CarbonReductionProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (!project.getNgo().getId().equals(ngo.getId())) {
            throw new UnauthorizedAccessException("Access denied. You cannot modify projects belonging to another NGO.");
        }

        return mapToDto(project);
    }

    @Transactional
    public NgoProjectDto updateProject(Long userId, Long projectId, NgoProjectDto dto) {
        Ngo ngo = getNgoByUserId(userId);
        CarbonReductionProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (!project.getNgo().getId().equals(ngo.getId())) {
            throw new UnauthorizedAccessException("Access denied. You cannot edit projects belonging to another NGO.");
        }

        project.setTitle(dto.getTitle().trim());
        project.setDescription(dto.getDescription().trim());
        project.setGoals(dto.getGoals().trim());
        project.setEstimatedImpact(dto.getEstimatedImpact().trim());
        project.setLocation(dto.getLocation().trim());
        project.setContactInformation(dto.getContactInformation().trim());
        project.setWebsite(dto.getWebsite());

        CarbonReductionProject saved = projectRepository.save(project);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteProject(Long userId, Long projectId) {
        Ngo ngo = getNgoByUserId(userId);
        CarbonReductionProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (!project.getNgo().getId().equals(ngo.getId())) {
            throw new UnauthorizedAccessException("Access denied. You cannot delete projects belonging to another NGO.");
        }

        projectRepository.delete(project);
    }

    @Transactional(readOnly = true)
    public List<NgoProjectDto> getAllPublicProjects() {
        return projectRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private Ngo getNgoByUserId(Long userId) {
        return ngoRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
                    Ngo newNgo = new Ngo(user, user.getName() + " Foundation", "Environmental NGO", "Unspecified", null, user.getEmail());
                    return ngoRepository.save(newNgo);
                });
    }

    private NgoProjectDto mapToDto(CarbonReductionProject p) {
        NgoProjectDto dto = new NgoProjectDto();
        dto.setId(p.getId());
        dto.setNgoId(p.getNgo().getId());
        dto.setNgoName(p.getNgo().getNgoName());
        dto.setTitle(p.getTitle());
        dto.setDescription(p.getDescription());
        dto.setGoals(p.getGoals());
        dto.setEstimatedImpact(p.getEstimatedImpact());
        dto.setLocation(p.getLocation());
        dto.setContactInformation(p.getContactInformation());
        dto.setWebsite(p.getWebsite());
        dto.setCreatedAt(p.getCreatedAt());
        return dto;
    }
}
