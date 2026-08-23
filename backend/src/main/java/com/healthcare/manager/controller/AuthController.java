package com.healthcare.manager.controller;

import com.healthcare.manager.dto.AuthResponse;
import com.healthcare.manager.dto.LoginRequest;
import com.healthcare.manager.dto.RegisterRequest;
import com.healthcare.manager.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request
    ) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }
    @GetMapping("/create-doctor-test")
    public ResponseEntity<String> createDoctorTest() {

        authService.createDoctorTestUser();

        return ResponseEntity.ok(
                "Doctor created successfully"
        );
    }
}