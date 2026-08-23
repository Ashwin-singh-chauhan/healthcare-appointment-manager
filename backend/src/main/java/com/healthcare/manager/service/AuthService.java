package com.healthcare.manager.service;

import com.healthcare.manager.dto.AuthResponse;
import com.healthcare.manager.dto.LoginRequest;
import com.healthcare.manager.dto.RegisterRequest;
import com.healthcare.manager.entity.Role;
import com.healthcare.manager.entity.User;
import com.healthcare.manager.repository.UserRepository;
import com.healthcare.manager.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // Public registration is only for patients.
        user.setRole(Role.PATIENT);

        user = userRepository.save(user);

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(
                        () -> new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
    public void createDoctorTestUser() {

        String email = "rahul@healthcare.com";

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Doctor user already exists");
        }

        User user = new User();

        user.setName("Dr. Rahul Sharma");
        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode("Doctor@123")
        );

        user.setRole(Role.DOCTOR);

        userRepository.save(user);
    }
}