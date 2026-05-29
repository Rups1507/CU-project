package com.cu.sweetmart.service;

import java.util.List;

import com.cu.sweetmart.model.User;

public interface UserService {
    User addUser(User user);
    User updateUser(User user);
    User cancelUser(Integer userId);
    List<User> showAllUser();
    boolean authenticate(String username, String password);
}
