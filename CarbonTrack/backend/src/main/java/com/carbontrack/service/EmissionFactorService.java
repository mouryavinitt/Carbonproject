package com.carbontrack.service;

import com.carbontrack.dto.EmissionFactorDto;
import com.carbontrack.entity.EmissionFactor;
import com.carbontrack.exception.ResourceNotFoundException;
import com.carbontrack.repository.EmissionFactorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmissionFactorService {

    private final EmissionFactorRepository emissionFactorRepository;

    public EmissionFactorService(EmissionFactorRepository emissionFactorRepository) {
        this.emissionFactorRepository = emissionFactorRepository;
    }

    @Transactional(readOnly = true)
    public List<EmissionFactorDto> getAllActiveFactors() {
        return emissionFactorRepository.findByActiveTrue()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmissionFactorDto> getFactorsByCategory(String category) {
        return emissionFactorRepository.findByCategoryAndActiveTrue(category)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmissionFactorDto getFactorById(Long id) {
        EmissionFactor ef = emissionFactorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emission factor not found with id: " + id));
        return mapToDto(ef);
    }

    @Transactional(readOnly = true)
    public EmissionFactor getEntityByActivity(String activityType) {
        return emissionFactorRepository.findByActivityTypeAndActiveTrue(activityType)
                .orElseThrow(() -> new ResourceNotFoundException("No verified emission factor found for activity: '" + activityType + "'. Authoritative source required before calculation can proceed."));
    }

    private EmissionFactorDto mapToDto(EmissionFactor ef) {
        return new EmissionFactorDto(
                ef.getId(),
                ef.getCategory(),
                ef.getActivityType(),
                ef.getUnit(),
                ef.getFactor(),
                ef.getSourceOrganization(),
                ef.getSourceDocument(),
                ef.getSourceUrl(),
                ef.getYear(),
                ef.getMethodology(),
                ef.getScope(),
                ef.isActive()
        );
    }
}
