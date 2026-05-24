package com.cu.sweetmart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cu.sweetmart.model.Category;

public interface CategoryRepo extends JpaRepository<Category, Integer> {

}
