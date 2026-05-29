package com.cu.sweetmart.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cu.sweetmart.exception.NoRecordsFoundException;
import com.cu.sweetmart.model.User;
import com.cu.sweetmart.repository.UserRepo;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User addUser(User user) {
        if (user == null) {
            throw new NoRecordsFoundException("User must not be null");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    @Override
    public User updateUser(User user) {
        User existing = userRepo.findById(user.getUserId())
                .orElseThrow(() -> new NoRecordsFoundException("User not found with id: " + user.getUserId()));

        existing.setUsername(user.getUsername());
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            existing.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepo.save(existing);
    }

    @Override
    public User cancelUser(Integer userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new NoRecordsFoundException("User not found with id: " + userId));
        userRepo.deleteById(userId);
        return user;
    }

    @Override
    public List<User> showAllUser() {
        List<User> users = userRepo.findAll();
        if (users.isEmpty()) {
            throw new NoRecordsFoundException("No users found");
        }
        return users;
    }

    @Override
    public boolean authenticate(String username, String password) {
        Optional<User> userOpt = userRepo.findByUsername(username);
        return userOpt.map(u -> passwordEncoder.matches(password, u.getPassword()))
                      .orElse(false);
    }
}
