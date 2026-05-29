package com.cu.sweetmart.service;

import java.util.Map;

public interface PaymentService {
    boolean verifyAndConfirmPayment(Map<String, String> payload);
}
