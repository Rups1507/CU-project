package com.cu.sweetmart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cu.sweetmart.model.Cart;

public interface CartRepo extends JpaRepository<Cart, Integer> {

}
