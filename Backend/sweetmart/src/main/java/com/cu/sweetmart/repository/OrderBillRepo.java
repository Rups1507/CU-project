package com.cu.sweetmart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cu.sweetmart.model.OrderBill;

public interface OrderBillRepo extends JpaRepository<OrderBill, Integer> {

}
