package com.cu.sweetmart.service;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.cu.sweetmart.repository.PaymentRepo;
import com.razorpay.Utils;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    private final PaymentRepo paymentRepository;

    public PaymentServiceImpl(PaymentRepo paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public boolean verifyAndConfirmPayment(Map<String, String> payload) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", payload.get("razorpayOrderId"));
            options.put("razorpay_payment_id", payload.get("razorpayPaymentId"));
            options.put("razorpay_signature", payload.get("razorpaySignature"));

            boolean isValid = Utils.verifyPaymentSignature(options, razorpaySecret);

            if (isValid) {
                String orderId = payload.get("razorpayOrderId");
                String paymentId = payload.get("razorpayPaymentId");
                paymentRepository.findByRazorpayOrderId(orderId).ifPresent(payment -> {
                    payment.setRazorpayPaymentId(paymentId);
                    payment.setStatus("SUCCESS");
                    paymentRepository.save(payment);
                });
                return true;
            }
        } catch (Exception e) {
            System.err.println("Razorpay verification failed: " + e.getMessage());
        }
        return false;
    }
}
