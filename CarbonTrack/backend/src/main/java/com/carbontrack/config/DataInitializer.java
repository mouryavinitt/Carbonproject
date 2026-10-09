package com.carbontrack.config;

import com.carbontrack.entity.EmissionFactor;
import com.carbontrack.repository.EmissionFactorRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final EmissionFactorRepository emissionFactorRepository;

    public DataInitializer(EmissionFactorRepository emissionFactorRepository) {
        this.emissionFactorRepository = emissionFactorRepository;
    }

    @Override
    public void run(String... args) {
        long count = emissionFactorRepository.count();
        if (count == 0) {
            logger.info("Initializing verified scientific emission factors database from CSV...");
            loadEmissionFactorsFromCsv();
        } else {
            logger.info("Emission factors table already populated with {} verified scientific factors.", count);
        }
    }

    private void loadEmissionFactorsFromCsv() {
        try {
            ClassPathResource resource = new ClassPathResource("emission-factors.csv");
            if (!resource.exists()) {
                logger.warn("emission-factors.csv not found in classpath. Seeding built-in authoritative factors...");
                seedDefaultFactors();
                return;
            }

            try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);
                 CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).build())) {

                for (CSVRecord record : csvParser) {
                    EmissionFactor ef = new EmissionFactor(
                            record.get("category"),
                            record.get("activityType"),
                            record.get("unit"),
                            new BigDecimal(record.get("factor")),
                            record.get("sourceOrganization"),
                            record.get("sourceDocument"),
                            record.get("sourceUrl"),
                            record.get("year"),
                            record.get("methodology"),
                            record.isSet("scope") ? record.get("scope") : "Scope 3"
                    );
                    emissionFactorRepository.save(ef);
                }
                logger.info("Successfully seeded {} verified scientific emission factors from CSV.", emissionFactorRepository.count());
            }
        } catch (Exception e) {
            logger.error("Error loading emission factors from CSV, seeding fallback verified factors", e);
            seedDefaultFactors();
        }
    }

    private void seedDefaultFactors() {
        emissionFactorRepository.save(new EmissionFactor("Electricity", "Grid Electricity (India Average)", "kWh",
                new BigDecimal("0.71600"), "Central Electricity Authority (CEA) India",
                "CO2 Baseline Database for the Indian Power Sector Ver 19.0", "https://cea.nic.in/cdm-co2-baseline-database/",
                "2023", "National weighted average grid emission factor calculated from thermal and renewable mix in regional grids", "Scope 2"));

        emissionFactorRepository.save(new EmissionFactor("Electricity", "Grid Electricity (UK Average)", "kWh",
                new BigDecimal("0.20707"), "UK DESNZ",
                "Government GHG Conversion Factors for Company Reporting 2023", "https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023",
                "2023", "Grid transmission and generation emission intensity", "Scope 2"));

        emissionFactorRepository.save(new EmissionFactor("Fuel", "Petrol / Gasoline", "litre",
                new BigDecimal("2.31495"), "UK DESNZ",
                "Government GHG Conversion Factors for Company Reporting 2023", "https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023",
                "2023", "Direct fuel combustion of 100% mineral petrol excluding upstream extraction", "Scope 1"));

        emissionFactorRepository.save(new EmissionFactor("Fuel", "Diesel", "litre",
                new BigDecimal("2.51233"), "UK DESNZ",
                "Government GHG Conversion Factors for Company Reporting 2023", "https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023",
                "2023", "Direct fuel combustion of 100% mineral diesel fuel", "Scope 1"));

        emissionFactorRepository.save(new EmissionFactor("Transport", "Local City Bus", "km",
                new BigDecimal("0.09650"), "UK DESNZ",
                "Government GHG Conversion Factors for Company Reporting 2023", "https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023",
                "2023", "Average passenger emissions per passenger-kilometer for urban buses", "Scope 3"));

        emissionFactorRepository.save(new EmissionFactor("Flights", "Domestic Flight (<500 km)", "km",
                new BigDecimal("0.24587"), "UK DESNZ & IPCC",
                "Government GHG Conversion Factors 2023 (including Radiative Forcing)", "https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023",
                "2023", "Passenger-km domestic flights including IPCC RF multiplier for high-altitude non-CO2 effects", "Scope 3"));

        logger.info("Default authoritative factors initialized successfully.");
    }
}
