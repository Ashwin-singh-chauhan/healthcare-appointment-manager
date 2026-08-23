package com.healthcare.manager.config;

import com.healthcare.manager.security.JwtAuthenticationFilter;

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

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // CORS CONFIGURATION
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
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

    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // CORS
                .cors(cors -> {})

                // CSRF disabled because this is a JWT API
                .csrf(AbstractHttpConfigurer::disable)

                // Stateless JWT authentication
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(auth -> auth

                        // Health check
                        .requestMatchers(
                                "/api/health"
                        ).permitAll()

                        // Spring error endpoint
                        .requestMatchers(
                                "/error"
                        ).permitAll()

                        // CORS preflight
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Authentication
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/register",
                                "/api/auth/login"
                        ).permitAll()

                        // Temporary doctor test endpoint
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/auth/create-doctor-test"
                        ).permitAll()

                        // Public doctor endpoints
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/doctors",
                                "/api/doctors/**"
                        ).permitAll()

                        // Public availability
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/availability/doctor/**"
                        ).permitAll()

                        // Doctor's own availability
                        .requestMatchers(
                                "/api/availability/my"
                        ).hasRole("DOCTOR")

                        // Admin availability
                        .requestMatchers(
                                "/api/admin/availability/**"
                        ).hasRole("ADMIN")

                        // Admin appointments
                        .requestMatchers(
                                "/api/admin/appointments/**"
                        ).hasRole("ADMIN")

                        // Admin leaves
                        .requestMatchers(
                                "/api/admin/leaves/**"
                        ).hasRole("ADMIN")

                        // Public slots
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/slots/doctor/**"
                        ).permitAll()

                        // Patient appointments
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

                        // Doctor appointments
                        .requestMatchers(
                                "/api/appointments/doctor/my"
                        ).hasRole("DOCTOR")

                        // Doctor leaves
                        .requestMatchers(
                                "/api/doctor/leaves/**"
                        ).hasRole("DOCTOR")

                        // Doctor APIs
                        .requestMatchers(
                                "/api/doctor/**"
                        ).hasRole("DOCTOR")

                        // Admin APIs
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                );

        // JWT filter
        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}
