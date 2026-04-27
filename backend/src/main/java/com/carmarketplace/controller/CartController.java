package com.carmarketplace.controller;

import com.carmarketplace.entity.Cart;
import com.carmarketplace.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users/{userId}/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(#userId, authentication)")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/{vehicleId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(#userId, authentication)")
    public ResponseEntity<Cart> addToCart(@PathVariable Long userId, @PathVariable Long vehicleId) {
        Cart cart = cartService.addVehicleToCart(userId, vehicleId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/{vehicleId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(#userId, authentication)")
    public ResponseEntity<Cart> removeVehicle(@PathVariable Long userId, @PathVariable Long vehicleId) {
        Cart cart = cartService.removeFromCart(userId, vehicleId);
        return ResponseEntity.ok(cart);
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(#userId, authentication)")
    public ResponseEntity<Cart> updateCart(@PathVariable Long userId, @RequestBody Cart updatedCart) {
        return cartService.updateCart(userId, updatedCart)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(#userId, authentication)")
    public ResponseEntity<String> checkout(@PathVariable Long userId) {
        cartService.checkout(userId);
        return ResponseEntity.ok("Order successfully completed.");
    }
}
