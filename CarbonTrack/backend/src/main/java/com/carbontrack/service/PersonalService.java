package com.carbontrack.service;

import com.carbontrack.dto.CalculationResultDto;
import com.carbontrack.dto.PersonalCalculationRequest;
import com.carbontrack.dto.PersonalDashboardDto;
import com.carbontrack.dto.PersonalProfileDto;
import com.carbontrack.entity.CarbonCalculation;
import com.carbontrack.entity.EmissionActivity;
import com.carbontrack.entity.PersonalProfile;
import com.carbontrack.entity.User;
import com.carbontrack.exception.ResourceNotFoundException;
import com.carbontrack.exception.UnauthorizedAccessException;
import com.carbontrack.repository.CarbonCalculationRepository;
import com.carbontrack.repository.PersonalProfileRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PersonalService {

    private final UserRepository userRepository;
    private final PersonalProfileRepository personalProfileRepository;
    private final CarbonCalculationRepository calculationRepository;
    private final CarbonCalculationEngine calculationEngine;

    public PersonalService(UserRepository userRepository,
                           PersonalProfileRepository personalProfileRepository,
                           CarbonCalculationRepository calculationRepository,
                           CarbonCalculationEngine calculationEngine) {
        this.userRepository = userRepository;
        this.personalProfileRepository = personalProfileRepository;
        this.calculationRepository = calculationRepository;
        this.calculationEngine = calculationEngine;
    }

    @Transactional(readOnly = true)
    public PersonalProfileDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        PersonalProfile profile = personalProfileRepository.findByUserId(userId)
                .orElseGet(() -> new PersonalProfile(user, "Unspecified", "Individual", ""));

        return new PersonalProfileDto(
                profile.getId(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                profile.getLocation(),
                profile.getOccupation(),
                profile.getBio()
        );
    }

    @Transactional
    public PersonalProfileDto updateProfile(Long userId, PersonalProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        PersonalProfile profile = personalProfileRepository.findByUserId(userId)
                .orElse(new PersonalProfile(user, "", "", ""));

        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName().trim());
            userRepository.save(user);
        }

        profile.setLocation(dto.getLocation());
        profile.setOccupation(dto.getOccupation());
        profile.setBio(dto.getBio());

        PersonalProfile saved = personalProfileRepository.save(profile);

        return new PersonalProfileDto(
                saved.getId(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                saved.getLocation(),
                saved.getOccupation(),
                saved.getBio()
        );
    }

    @Transactional
    public CalculationResultDto saveCalculation(Long userId, PersonalCalculationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        CarbonCalculationEngine.ComputedCalculation computed = calculationEngine.computePersonalEmissions(request.getActivities());

        CarbonCalculation calculation = new CarbonCalculation();
        calculation.setUser(user);
        calculation.setCalculationDate(LocalDate.now());
        calculation.setPeriod(request.getPeriod() != null && !request.getPeriod().isBlank() ? request.getPeriod() : "Monthly Calculation");
        calculation.setTotalEmission(computed.totalEmission);
        calculation.setElectricityEmission(computed.electricityEmission);
        calculation.setTransportEmission(computed.transportEmission);
        calculation.setFlightEmission(computed.flightEmission);
        calculation.setFoodEmission(computed.foodEmission);
        calculation.setWasteEmission(computed.wasteEmission);
        calculation.setOtherEmission(computed.otherEmission);
        calculation.setHighestCategory(computed.highestCategory);

        for (EmissionActivity act : computed.activities) {
            calculation.addActivity(act);
        }

        CarbonCalculation saved = calculationRepository.save(calculation);

        CalculationResultDto result = mapToResultDto(saved);
        result.setRecommendations(computed.recommendations);
        return result;
    }

    @Transactional(readOnly = true)
    public List<CalculationResultDto> getHistory(Long userId, String year, String month) {
        List<CarbonCalculation> list = calculationRepository.findByUserIdOrderByCalculationDateDesc(userId);

        if (year != null && !year.isBlank()) {
            int y = Integer.parseInt(year);
            list = list.stream()
                    .filter(c -> c.getCalculationDate().getYear() == y)
                    .collect(Collectors.toList());
        }

        if (month != null && !month.isBlank()) {
            int m = Integer.parseInt(month);
            list = list.stream()
                    .filter(c -> c.getCalculationDate().getMonthValue() == m)
                    .collect(Collectors.toList());
        }

        return list.stream().map(this::mapToResultDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CalculationResultDto getCalculationById(Long userId, Long calculationId) {
        CarbonCalculation calculation = calculationRepository.findById(calculationId)
                .orElseThrow(() -> new ResourceNotFoundException("Calculation not found with id: " + calculationId));

        if (!calculation.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("Access denied. You cannot view calculations belonging to other users.");
        }

        CalculationResultDto dto = mapToResultDto(calculation);

        Map<String, BigDecimal> categoryTotals = new HashMap<>();
        categoryTotals.put("Electricity", calculation.getElectricityEmission());
        categoryTotals.put("Transport", calculation.getTransportEmission());
        categoryTotals.put("Flights", calculation.getFlightEmission());
        categoryTotals.put("Food", calculation.getFoodEmission());
        categoryTotals.put("Waste", calculation.getWasteEmission());

        dto.setRecommendations(calculationEngine.generateRecommendations(calculation.getHighestCategory(), categoryTotals, calculation.getTotalEmission()));
        return dto;
    }

    @Transactional
    public void deleteCalculation(Long userId, Long calculationId) {
        CarbonCalculation calculation = calculationRepository.findById(calculationId)
                .orElseThrow(() -> new ResourceNotFoundException("Calculation not found with id: " + calculationId));

        if (!calculation.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("Access denied. You cannot delete calculations belonging to other users.");
        }

        calculationRepository.delete(calculation);
    }

    @Transactional(readOnly = true)
    public PersonalDashboardDto getDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        PersonalDashboardDto dto = new PersonalDashboardDto();
        dto.setUserName(user.getName());

        List<CarbonCalculation> calculations = calculationRepository.findByUserIdOrderByCalculationDateDesc(userId);
        dto.setTotalCalculationsCount(calculations.size());

        if (calculations.isEmpty()) {
            dto.setCategoryBreakdown(new HashMap<>());
            dto.setReductionSuggestions(List.of(
                    "Welcome to CarbonTrack! You currently have no saved calculations.",
                    "Use the Carbon Calculator to record your energy, transport, diet, and waste footprint to unlock your tailored reduction roadmap."
            ));
            return dto;
        }

        // Totals
        BigDecimal total = calculations.stream()
                .map(CarbonCalculation::getTotalEmission)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalEmissionsRecorded(total);

        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate startOfYear = now.withDayOfYear(1);

        BigDecimal thisMonth = calculations.stream()
                .filter(c -> !c.getCalculationDate().isBefore(startOfMonth))
                .map(CarbonCalculation::getTotalEmission)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setThisMonthEmissions(thisMonth);

        BigDecimal thisYear = calculations.stream()
                .filter(c -> !c.getCalculationDate().isBefore(startOfYear))
                .map(CarbonCalculation::getTotalEmission)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setThisYearEmissions(thisYear);

        // Aggregated category breakdown
        BigDecimal totalElec = calculations.stream().map(CarbonCalculation::getElectricityEmission).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalTrans = calculations.stream().map(CarbonCalculation::getTransportEmission).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalFlight = calculations.stream().map(CarbonCalculation::getFlightEmission).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalFood = calculations.stream().map(CarbonCalculation::getFoodEmission).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalWaste = calculations.stream().map(CarbonCalculation::getWasteEmission).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalOther = calculations.stream().map(CarbonCalculation::getOtherEmission).reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> breakdown = new LinkedHashMap<>();
        breakdown.put("Electricity", totalElec);
        breakdown.put("Transport", totalTrans);
        breakdown.put("Flights", totalFlight);
        breakdown.put("Food", totalFood);
        breakdown.put("Waste", totalWaste);
        if (totalOther.compareTo(BigDecimal.ZERO) > 0) {
            breakdown.put("Other", totalOther);
        }
        dto.setCategoryBreakdown(breakdown);

        // Determine highest category
        String highest = "Electricity";
        BigDecimal max = BigDecimal.ZERO;
        for (Map.Entry<String, BigDecimal> e : breakdown.entrySet()) {
            if (e.getValue().compareTo(max) > 0) {
                max = e.getValue();
                highest = e.getKey();
            }
        }
        dto.setHighestCategory(highest);

        // Monthly trend (last 6 months)
        Map<String, BigDecimal> monthMap = new LinkedHashMap<>();
        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("MMM yyyy");
        for (int i = 5; i >= 0; i--) {
            LocalDate m = now.minusMonths(i);
            monthMap.put(m.format(monthFmt), BigDecimal.ZERO);
        }

        for (CarbonCalculation c : calculations) {
            String mKey = c.getCalculationDate().format(monthFmt);
            if (monthMap.containsKey(mKey)) {
                monthMap.put(mKey, monthMap.get(mKey).add(c.getTotalEmission()));
            }
        }

        List<PersonalDashboardDto.MonthlyTrendPointDto> trend = monthMap.entrySet().stream()
                .map(e -> new PersonalDashboardDto.MonthlyTrendPointDto(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
        dto.setMonthlyTrend(trend);

        // Dynamic reduction suggestions based on actual user data
        dto.setReductionSuggestions(calculationEngine.generateRecommendations(highest, breakdown, total));

        // Recent calculations (up to 5)
        dto.setRecentCalculations(calculations.stream().limit(5).map(this::mapToResultDto).collect(Collectors.toList()));

        return dto;
    }

    private CalculationResultDto mapToResultDto(CarbonCalculation calc) {
        CalculationResultDto dto = new CalculationResultDto();
        dto.setId(calc.getId());
        dto.setUserId(calc.getUser().getId());
        dto.setCalculationDate(calc.getCalculationDate());
        dto.setPeriod(calc.getPeriod());
        dto.setTotalEmission(calc.getTotalEmission());
        dto.setElectricityEmission(calc.getElectricityEmission());
        dto.setTransportEmission(calc.getTransportEmission());
        dto.setFlightEmission(calc.getFlightEmission());
        dto.setFoodEmission(calc.getFoodEmission());
        dto.setWasteEmission(calc.getWasteEmission());
        dto.setOtherEmission(calc.getOtherEmission());
        dto.setHighestCategory(calc.getHighestCategory());
        dto.setCreatedAt(calc.getCreatedAt());

        if (calc.getActivities() != null) {
            List<CalculationResultDto.CalculatedActivityItemDto> items = calc.getActivities().stream()
                    .map(a -> new CalculationResultDto.CalculatedActivityItemDto(
                            a.getCategory(),
                            a.getActivityType(),
                            a.getQuantity(),
                            a.getUnit(),
                            a.getEmissionFactor(),
                            a.getEmission(),
                            a.getFactorSource()
                    ))
                    .collect(Collectors.toList());
            dto.setBreakdown(items);
        }

        return dto;
    }
}
