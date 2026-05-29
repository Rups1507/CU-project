package com.cu.sweetmart.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cu.sweetmart.model.Payment;

public interface PaymentRepo extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
}
