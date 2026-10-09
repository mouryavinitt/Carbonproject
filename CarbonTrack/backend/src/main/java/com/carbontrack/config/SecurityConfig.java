
package com.carbontrack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.carbontrack.security.CustomUserDetailsService;
import com.carbontrack.security.JwtAuthenticationEntryPoint;
import com.carbontrack.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            CustomUserDetailsService userDetailsService,
            JwtAuthenticationEntryPoint unauthorizedHandler,
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/h2-console/**")
            )
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin())
            )
            .cors(cors -> {})
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(unauthorizedHandler)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

                // H2 database console
                .requestMatchers("/h2-console", "/h2-console/**").permitAll()

                // Authentication endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Public GET endpoints
                .requestMatchers(HttpMethod.GET, "/api/emission-factors/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()

                // Swagger and OpenAPI
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/swagger-resources/**",
                    "/webjars/**"
                ).permitAll()

                // Protected endpoints
                .requestMatchers("/api/personal/**")
                    .hasAnyRole("PERSONAL", "ORGANIZATION", "NGO")
                .requestMatchers("/api/organizations/**")
                    .hasRole("ORGANIZATION")
                .requestMatchers("/api/ngos/**")
                    .hasRole("NGO")

                // Everything else requires authentication
                .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());

        http.addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}

