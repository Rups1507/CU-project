package com.cu.sweetmart.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cu.sweetmart.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyPayment(@RequestBody Map<String, String> paymentData) {
        boolean isSuccess = paymentService.verifyAndConfirmPayment(paymentData);

        if (isSuccess) {
            return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Payment verified successfully"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("status", "FAILED", "message", "Invalid payment signature"));
    }
}
