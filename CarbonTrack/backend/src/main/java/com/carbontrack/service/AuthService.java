package com.carbontrack.service;

import com.carbontrack.dto.AuthResponse;
import com.carbontrack.dto.LoginRequest;
import com.carbontrack.dto.RegisterRequest;
import com.carbontrack.dto.UserDto;
import com.carbontrack.entity.*;
import com.carbontrack.exception.BadRequestException;
import com.carbontrack.repository.*;
import com.carbontrack.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PersonalProfileRepository personalProfileRepository;
    private final OrganizationRepository organizationRepository;
    private final NgoRepository ngoRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PersonalProfileRepository personalProfileRepository,
                       OrganizationRepository organizationRepository,
                       NgoRepository ngoRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.personalProfileRepository = personalProfileRepository;
        this.organizationRepository = organizationRepository;
        this.ngoRepository = ngoRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists.");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        // Initialize role-specific profile
        if (user.getRole() == Role.PERSONAL) {
            PersonalProfile profile = new PersonalProfile(
                    savedUser,
                    request.getLocation() != null ? request.getLocation() : "Unspecified",
                    "Individual",
                    "Personal carbon tracker account"
            );
            personalProfileRepository.save(profile);
        } else if (user.getRole() == Role.ORGANIZATION) {
            String orgName = request.getOrganizationName() != null && !request.getOrganizationName().isBlank()
                    ? request.getOrganizationName().trim()
                    : request.getName() + " Corp";
            String ind = request.getIndustry() != null ? request.getIndustry() : "General";
            Organization org = new Organization(savedUser, orgName, ind, request.getLocation(), 25);
            organizationRepository.save(org);
        } else if (user.getRole() == Role.NGO) {
            String ngoName = request.getNgoName() != null && !request.getNgoName().isBlank()
                    ? request.getNgoName().trim()
                    : request.getName() + " Foundation";
            Ngo ngo = new Ngo(savedUser, ngoName, "Environmental non-profit focused on carbon reduction.", request.getLocation(), null, savedUser.getEmail());
            ngoRepository.save(ngo);
        }

        // Authenticate & create JWT
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found with id: " + userId));
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }
}
