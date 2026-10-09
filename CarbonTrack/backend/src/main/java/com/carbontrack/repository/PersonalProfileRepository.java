package com.carbontrack.repository;

import com.carbontrack.entity.PersonalProfile;
import com.carbontrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonalProfileRepository extends JpaRepository<PersonalProfile, Long> {
    Optional<PersonalProfile> findByUser(User user);
    Optional<PersonalProfile> findByUserId(Long userId);
}
