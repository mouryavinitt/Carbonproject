package com.carbontrack;

import com.carbontrack.dto.AuthResponse;
import com.carbontrack.dto.RegisterRequest;
import com.carbontrack.entity.Role;
import com.carbontrack.entity.User;
import com.carbontrack.exception.BadRequestException;
import com.carbontrack.repository.PersonalProfileRepository;
import com.carbontrack.repository.UserRepository;
import com.carbontrack.security.JwtTokenProvider;
import com.carbontrack.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PersonalProfileRepository personalProfileRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("Should successfully register a new user and return JWT")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Vinitt Mourya");
        request.setEmail("mourya@carbontrack.org");
        request.setPassword("SecurePass123!");
        request.setRole(Role.PERSONAL);

        when(userRepository.existsByEmail("mourya@carbontrack.org")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed_bcrypt_password");

        User savedUser = new User("Vinitt Mourya", "mourya@carbontrack.org", "hashed_bcrypt_password", Role.PERSONAL);
        savedUser.setId(1L);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("sample_jwt_token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("sample_jwt_token", response.getToken());
        assertEquals("mourya@carbontrack.org", response.getEmail());
        assertEquals(Role.PERSONAL, response.getRole());
    }

    @Test
    @DisplayName("Should reject registration when email is already registered")
    void testRejectDuplicateEmail() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Duplicate User");
        request.setEmail("existing@carbontrack.org");
        request.setPassword("Pass1234");
        request.setRole(Role.PERSONAL);

        when(userRepository.existsByEmail("existing@carbontrack.org")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> {
            authService.register(request);
        });
    }
}
