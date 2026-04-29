package com.carmarketplace.controller;

import com.carmarketplace.entity.Order;
import com.carmarketplace.exception.ResourceNotFoundException;
import com.carmarketplace.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/{userId}/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(#userId, authentication)")
    public ResponseEntity<List<Order>> getOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderRepository.findByUserUserId(userId));
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(#userId, authentication)")
    public ResponseEntity<Order> getOrder(@PathVariable Long userId, @PathVariable Long orderId) {
        Order order = orderRepository.findByOrderIdAndUserUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        return ResponseEntity.ok(order);
    }
}
