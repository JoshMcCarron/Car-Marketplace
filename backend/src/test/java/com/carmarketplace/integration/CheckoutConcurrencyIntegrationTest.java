package com.carmarketplace.integration;

import com.carmarketplace.TestDataFactory;
import com.carmarketplace.entity.User;
import com.carmarketplace.entity.Vehicle;
import com.carmarketplace.exception.BadRequestException;
import com.carmarketplace.repository.OrderRepository;
import com.carmarketplace.repository.UserRepository;
import com.carmarketplace.repository.VehicleRepository;
import com.carmarketplace.service.CartService;
import com.carmarketplace.service.PaymentService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Many buyers check out the last unit of a vehicle at the same moment.
 * Not @Transactional: each checkout must commit in its own transaction, exactly as in production,
 * so this test cleans up the rows it creates afterwards.
 */
@SpringBootTest
@ActiveProfiles("test")
class CheckoutConcurrencyIntegrationTest {

    private static final int BUYERS = 10;

    @Autowired CartService cartService;
    @Autowired UserRepository userRepository;
    @Autowired VehicleRepository vehicleRepository;
    @Autowired OrderRepository orderRepository;

    @MockBean PaymentService paymentService;

    private final List<User> users = new ArrayList<>();
    private Vehicle vehicle;

    @AfterEach
    void cleanUp() {
        for (User u : users) {
            orderRepository.deleteAll(orderRepository.findByUserUserId(u.getUserId()));
            // buyers who lost the race still hold the vehicle in their cart; empty it first
            if (vehicle != null) cartService.removeFromCart(u.getUserId(), vehicle.getVehicleID());
        }
        userRepository.deleteAll(users);   // cascades to each user's cart
        if (vehicle != null) vehicleRepository.deleteById(vehicle.getVehicleID());
    }

    @Test
    @DisplayName("checkout: concurrent buyers of the last unit -> exactly one order, stock never negative")
    void concurrentCheckouts_doNotOversell() throws Exception {
        when(paymentService.processPayment(any())).thenReturn(true);
        vehicle = vehicleRepository.save(TestDataFactory.buildVehicle("Ford", 1));

        for (int i = 0; i < BUYERS; i++) {
            User u = userRepository.save(TestDataFactory.buildUser("race" + i + "@example.com", "USER"));
            users.add(u);
            cartService.addVehicleToCart(u.getUserId(), vehicle.getVehicleID());
        }

        ExecutorService pool = Executors.newFixedThreadPool(BUYERS);
        CountDownLatch start = new CountDownLatch(1);
        List<Future<Boolean>> results = new ArrayList<>();
        for (User u : users) {
            results.add(pool.submit(() -> {
                start.await();
                try {
                    cartService.checkout(u.getUserId());
                    return true;
                } catch (BadRequestException outOfStock) {
                    return false;
                }
            }));
        }
        start.countDown();   // release all buyers at once
        int succeeded = 0;
        for (Future<Boolean> f : results) {
            if (f.get(30, TimeUnit.SECONDS)) succeeded++;
        }
        pool.shutdown();

        long orders = users.stream()
                .mapToLong(u -> orderRepository.findByUserUserId(u.getUserId()).size())
                .sum();
        int stockAfter = vehicleRepository.findById(vehicle.getVehicleID()).orElseThrow().getStock();

        assertThat(succeeded).isEqualTo(1);
        assertThat(orders).isEqualTo(1);
        assertThat(stockAfter).isZero();
    }
}
