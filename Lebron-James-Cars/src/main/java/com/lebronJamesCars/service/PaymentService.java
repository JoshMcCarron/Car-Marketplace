package com.lebronJamesCars.service;

import java.math.BigDecimal;

public class PaymentService {
    private static int paymentCounter = 0;

    public static boolean processPayment(BigDecimal bigDecimal) {
        paymentCounter++;
        
        if (paymentCounter <= 2) {
            // Approve first two payments
            return true;
        } else {
            // Deny every third payment and reset counter
            paymentCounter = 0;
            return false;
        }
    }
}