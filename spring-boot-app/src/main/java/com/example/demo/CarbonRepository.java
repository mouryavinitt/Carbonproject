package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CarbonRepository extends JpaRepository<CarbonRecord, Integer> {
}