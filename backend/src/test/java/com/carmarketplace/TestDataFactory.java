package com.carmarketplace;

import com.carmarketplace.entity.Review;
import com.carmarketplace.entity.User;
import com.carmarketplace.entity.Vehicle;

import java.math.BigDecimal;

public class TestDataFactory {

    public static User buildUser(String email, String role) {
        User user = new User(); // no-arg constructor auto-creates and links a Cart
        user.setName("Test User");
        user.setEmail(email);
        user.setPassword("$2a$10$hashedPasswordPlaceholder");
        user.setAddress("123 Main St");
        user.setPostalCode("K1A0A6");
        user.setCity("Ottawa");
        user.setProvince("ON");
        user.setPhoneNum("613-555-0100");
        user.setRole(role);
        return user;
    }

    public static Vehicle buildVehicle(String brand, int stock) {
        return new Vehicle(
                brand, "SUV", "new",
                2024, stock, 60,
                95.0, new BigDecimal("3.99"), new BigDecimal("25000.00"),
                0.0, 7.5, false, 0.0
        );
    }

    public static Review buildReview(User user, Vehicle vehicle) {
        return new Review(user, vehicle, 5, "Great car");
    }
}
