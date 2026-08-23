package com.healthcare.manager.config;

import com.healthcare.manager.security.JwtAuthenticationFilter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Frontend URL
    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // ==========================================
    // PASSWORD ENCODER
    // ==========================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ==========================================
    // CORS CONFIGURATION
    // ==========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        frontendUrl,
                        "https://healthcare-appointment-manager-gamma.vercel.app"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // ==========================================
    // SECURITY FILTER CHAIN
    // ==========================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // CORS
                .cors(cors -> {})

                // CSRF disabled because we use JWT
                .csrf(AbstractHttpConfigurer::disable)

                // Stateless JWT authentication
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // ==========================================
                // AUTHORIZATION RULES
                // ==========================================

                .authorizeHttpRequests(auth -> auth

                        // ------------------------------
                        // HEALTH
                        // ------------------------------

                        .requestMatchers(
                                "/api/health"
                        ).permitAll()

                        .requestMatchers(
                                "/error"
                        ).permitAll()

                        // ------------------------------
                        // CORS PREFLIGHT
                        // ------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // ------------------------------
                        // AUTH
                        // ------------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/register",
                                "/api/auth/login"
                        ).permitAll()

                        // ------------------------------
                        // TEST DOCTOR CREATION
                        // ------------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/auth/create-doctor-test"
                        ).permitAll()

                        // ------------------------------
                        // DOCTORS
                        // ------------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/doctors",
                                "/api/doctors/**"
                        ).permitAll()

                        // ------------------------------
                        // AVAILABILITY
                        // ------------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/availability/doctor/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/availability/my"
                        ).hasRole("DOCTOR")

                        // ------------------------------
                        // ADMIN AVAILABILITY
                        // ------------------------------

                        .requestMatchers(
                                "/api/admin/availability/**"
                        ).hasRole("ADMIN")

                        // ------------------------------
                        // ADMIN APPOINTMENTS
                        // ------------------------------

                        .requestMatchers(
                                "/api/admin/appointments/**"
                        ).hasRole("ADMIN")

                        // ------------------------------
                        // ADMIN LEAVES
                        // ------------------------------

                        .requestMatchers(
                                "/api/admin/leaves/**"
                        ).hasRole("ADMIN")

                        // ------------------------------
                        // SLOTS
                        // ------------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/slots/doctor/**"
                        ).permitAll()

                        // ------------------------------
                        // PATIENT APPOINTMENTS
                        // ------------------------------

                        .requestMatchers(
                                "/api/appointments/my"
                        ).hasRole("PATIENT")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/appointments"
                        ).hasRole("PATIENT")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/appointments/**"
                        ).hasRole("PATIENT")

                        // ------------------------------
                        // DOCTOR LEAVES
                        // ------------------------------

                        .requestMatchers(
                                "/api/doctor/leaves/**"
                        ).hasRole("DOCTOR")

                        // ------------------------------
                        // DOCTOR APPOINTMENTS
                        // ------------------------------

                        .requestMatchers(
                                "/api/appointments/doctor/my"
                        ).hasRole("DOCTOR")

                        // ------------------------------
                        // DOCTOR APIs
                        // ------------------------------

                        .requestMatchers(
                                "/api/doctor/**"
                        ).hasRole("DOCTOR")

                        // ------------------------------
                        // ADMIN APIs
                        // ------------------------------

                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // ------------------------------
                        // EVERYTHING ELSE
                        // ------------------------------

                        .anyRequest().authenticated()
                );

        // ==========================================
        // JWT FILTER
        // ==========================================

        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}
