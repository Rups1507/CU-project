package com.cu.sweetmart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cu.sweetmart.model.OrderItem;

public interface OrderItemRepo extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findBySweetOrderSweetOrderId(Integer sweetOrderId);
}
