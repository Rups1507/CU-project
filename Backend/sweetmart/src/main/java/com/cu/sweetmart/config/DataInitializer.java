package com.cu.sweetmart.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.cu.sweetmart.model.Admin;
import com.cu.sweetmart.repository.UserRepo;


@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepo.findByUsername("admin").isEmpty()) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setActive(true);
            admin.setRole("ROLE_ADMIN");
            userRepo.save(admin);
            System.out.println(">>> Default admin user created (admin / admin123)");
        }
    }
}
