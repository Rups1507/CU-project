package com.cu.sweetmart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cu.sweetmart.model.SweetOrder;

public interface SweetOrderRepo extends JpaRepository<SweetOrder, Integer> {
    List<SweetOrder> findByCustomerUserId(Integer customerId);
}