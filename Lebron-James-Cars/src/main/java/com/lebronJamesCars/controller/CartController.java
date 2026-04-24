package com.lebronJamesCars.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lebronJamesCars.entity.Cart;
import com.lebronJamesCars.service.CartService;

@RestController
@RequestMapping("/users/{userId}/cart")
public class CartController {
    
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }
    
    // Get user's cart
    @GetMapping
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        try {
            Cart cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Add vehicle to cart
    @PostMapping("/{vehicleId}")
    public ResponseEntity<Cart> addToCart(
            @PathVariable Long userId,
            @PathVariable Long vehicleId) {
        try {
            Cart cart = cartService.addVehicleToCart(userId, vehicleId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Remove vehicle from cart
    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<Cart> removeVehicle(
            @PathVariable Long userId,
            @PathVariable Long vehicleId) {
        try {
            Cart cart = cartService.removeFromCart(userId, vehicleId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Update cart
    @PutMapping
    public ResponseEntity<Cart> updateCart(
            @PathVariable Long userId,
            @RequestBody Cart updatedCart) {
        return cartService.updateCart(userId, updatedCart)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping("/checkout")
    public ResponseEntity<String> checkout(@PathVariable Long userId) {
        try {
            cartService.checkout(userId);
            return ResponseEntity.ok("Order successfully completed.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
}