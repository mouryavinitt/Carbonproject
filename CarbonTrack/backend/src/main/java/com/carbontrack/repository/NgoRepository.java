package com.carbontrack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.carbontrack.entity.Ngo;

@Repository
public interface NgoRepository extends JpaRepository<Ngo, Long> {

    Optional<Ngo> findByUserId(Long userId);
}