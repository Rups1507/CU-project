package com.cu.sweetmart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cu.sweetmart.model.Product;

public interface ProductRepo extends JpaRepository<Product, Integer> {

}
