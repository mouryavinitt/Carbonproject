package com.carbontrack.repository;

import com.carbontrack.entity.Organization;
import com.carbontrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByUser(User user);
    Optional<Organization> findByUserId(Long userId);
}
