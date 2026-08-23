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
        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
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

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .cors(cors -> {})

                .csrf(AbstractHttpConfigurer::disable)

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/health"
                        ).permitAll()

                        .requestMatchers(
                                "/error"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/register",
                                "/api/auth/login"
                        ).permitAll()
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/auth/create-doctor-test"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/doctors",
                                "/api/doctors/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/availability/doctor/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/availability/my"
                        )
                        .hasRole("DOCTOR")

                        .requestMatchers(
                                "/api/admin/availability/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/admin/appointments/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/admin/leaves/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/slots/doctor/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/appointments/my"
                        ).hasRole("PATIENT")
                        .requestMatchers(
                                "/api/doctor/leaves/**"
                        )
                        .hasRole("DOCTOR")
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/appointments"
                        ).hasRole("PATIENT")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/appointments/**"
                        ).hasRole("PATIENT")

                        .requestMatchers(
                                "/api/appointments/doctor/my"
                        )
                        .hasRole("DOCTOR")

                        .requestMatchers(
                                "/api/doctor/**"
                        ).hasRole("DOCTOR")

                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        .anyRequest().authenticated()
                );

        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}