package com.cu.sweetmart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cu.sweetmart.model.User;

public interface UserRepo extends JpaRepository<User, Integer> {

}
