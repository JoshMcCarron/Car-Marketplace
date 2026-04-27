package com.carmarketplace.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PaymentService {

    public boolean processPayment(BigDecimal amount) {
        // TODO: integrate Stripe
        return true;
    }
}
