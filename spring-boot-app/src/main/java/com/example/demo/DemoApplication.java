package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@SpringBootApplication
@RestController
@RequestMapping("/api/carbon")
@CrossOrigin(origins = "*")
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @GetMapping("/stats")
    public Map<String, Object> getCarbonStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEmissionsKg", 450.5);
        stats.put("monthlyAverageKg", 120.2);
        stats.put("footprintStatus", "Low Carbon Impact");
        return stats;
    }
}