package com.cu.sweetmart.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cu.sweetmart.model.Admin;
import com.cu.sweetmart.model.Customer;
import com.cu.sweetmart.model.User;
import com.cu.sweetmart.repository.UserRepo;
import com.cu.sweetmart.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        boolean isValid = userService.authenticate(username, password);

        if (isValid) {
            
            User user = userRepo.findByUsername(username).orElse(null);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("username", username);
            response.put("userId", user != null ? String.valueOf(user.getUserId()) : "");

            
            if (user instanceof Admin) {
                response.put("role", "ROLE_ADMIN");
            } else if (user instanceof Customer) {
                response.put("role", "ROLE_CUSTOMER");
                response.put("address", ((Customer) user).getAddress());
            } else {
                response.put("role", "ROLE_CUSTOMER");
            }

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid username or password"));
    }
}
