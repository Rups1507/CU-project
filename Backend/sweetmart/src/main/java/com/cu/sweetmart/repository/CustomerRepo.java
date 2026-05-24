package com.cu.sweetmart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cu.sweetmart.model.Customer;

public interface CustomerRepo extends JpaRepository<Customer, Integer> {

}
