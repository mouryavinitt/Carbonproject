package com.example.demo;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/carbon")
@CrossOrigin(origins = "*")
public class CarbonController {

    private final CarbonRepository repository;

    public CarbonController(CarbonRepository repository) {
        this.repository = repository;
    }

    // GET - Get all carbon records
    @GetMapping
    public List<CarbonRecord> getAllRecords() {
        return repository.findAll();
    }

    // GET - Get one record by ID
    @GetMapping("/{id}")
    public CarbonRecord getRecord(@PathVariable int id) {
        return repository.findById(id).orElse(null);
    }

    // POST - Create a carbon record
    @PostMapping
    public CarbonRecord createRecord(@RequestBody CarbonRecord record) {

        calculateEmission(record);

        return repository.save(record);
    }

    // PUT - Update a carbon record
    @PutMapping("/{id}")
    public CarbonRecord updateRecord(
            @PathVariable int id,
            @RequestBody CarbonRecord updatedRecord) {

        if (!repository.existsById(id)) {
            return null;
        }

        updatedRecord.setId(id);

        calculateEmission(updatedRecord);

        return repository.save(updatedRecord);
    }

    // DELETE - Delete a carbon record
    @DeleteMapping("/{id}")
    public String deleteRecord(@PathVariable int id) {

        if (repository.existsById(id)) {
            repository.deleteById(id);
            return "Carbon record deleted successfully";
        }

        return "Record not found";
    }

    // Calculate carbon emissions
    private void calculateEmission(CarbonRecord record) {

        double electricityEmission =
                record.getElectricityUnits() * 0.82;

        double gasEmission =
                record.getGasUnits() * 2.98;

        double travelFactor;

        switch (record.getTravelMode().toLowerCase()) {

            case "car":
                travelFactor = 0.21;
                break;

            case "bus":
                travelFactor = 0.10;
                break;

            case "train":
                travelFactor = 0.04;
                break;

            case "bike":
                travelFactor = 0.05;
                break;

            case "ev":
                travelFactor = 0.05;
                break;

            case "walk":
            case "cycle":
                travelFactor = 0.0;
                break;

            default:
                travelFactor = 0.0;
        }

        double travelEmission =
                record.getTravelDistance() * travelFactor;

        double totalEmission =
                electricityEmission +
                gasEmission +
                travelEmission;

        record.setElectricityEmission(electricityEmission);
        record.setGasEmission(gasEmission);
        record.setTravelEmission(travelEmission);
        record.setTotalEmission(totalEmission);

        if (totalEmission <= 5) {
            record.setEmissionRating("Low");
        } else if (totalEmission <= 10) {
            record.setEmissionRating("Moderate");
        } else {
            record.setEmissionRating("High");
        }
    }
}