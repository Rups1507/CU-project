package com.cu.sweetmart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cu.sweetmart.model.SweetItem;

public interface SweetItemRepo extends JpaRepository<SweetItem, Integer> {

}
