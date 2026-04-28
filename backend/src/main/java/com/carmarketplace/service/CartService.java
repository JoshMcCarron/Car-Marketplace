package com.carmarketplace.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carmarketplace.entity.Cart;
import com.carmarketplace.entity.Vehicle;
import com.carmarketplace.exception.BadRequestException;
import com.carmarketplace.exception.ResourceNotFoundException;
import com.carmarketplace.repository.CartRepository;
import com.carmarketplace.repository.VehicleRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final VehicleRepository vehicleRepository;
    private final PaymentService paymentService;

    public CartService(CartRepository cartRepository, VehicleRepository vehicleRepository,
                       PaymentService paymentService) {
        this.cartRepository = cartRepository;
        this.vehicleRepository = vehicleRepository;
        this.paymentService = paymentService;
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    public Optional<Cart> getCartById(Long id) {
        return cartRepository.findById(id);
    }

    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public Optional<Cart> updateCart(Long id, Cart newCart) {
        return cartRepository.findById(id).map(cart -> {
            cart.setUser(newCart.getUser());
            cart.setVehicles(newCart.getVehicles());
            updateCartTotals(cart);
            return cartRepository.save(cart);
        });
    }

    public boolean deleteCart(Long id) {
        if (cartRepository.existsById(id)) {
            cartRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userId));
    }

    public Cart addVehicleToCart(Long userId, Long vehicleId) {
        Cart cart = getCartByUserId(userId);
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + vehicleId));

        if (!cart.getVehicles().contains(vehicle)) {
            cart.getVehicles().add(vehicle);
            updateCartTotals(cart);
        }
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(Long userId, Long vehicleId) {
        Cart cart = getCartByUserId(userId);
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + vehicleId));

        if (cart.getVehicles().contains(vehicle)) {
            cart.getVehicles().remove(vehicle);
            updateCartTotals(cart);
        }
        return cartRepository.save(cart);
    }

    @Transactional
    public void checkout(Long userId) {
        Cart cart = getCartByUserId(userId);
        if (cart.getVehicles().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        for (Vehicle vehicle : cart.getVehicles()) {
            if (vehicle.getStock() <= 0) {
                throw new BadRequestException("Vehicle " + vehicle.getVehicleID() + " is out of stock");
            }
        }

        if (!paymentService.processPayment(cart.getPrice())) {
            throw new BadRequestException("Credit card authorization failed");
        }

        for (Vehicle vehicle : cart.getVehicles()) {
            vehicle.setStock(vehicle.getStock() - 1);
            vehicleRepository.save(vehicle);
        }

        cart.getVehicles().clear();
        updateCartTotals(cart);
        cartRepository.save(cart);
    }

    private void updateCartTotals(Cart cart) {
        List<Vehicle> vehicles = cart.getVehicles();
        cart.setNoItems(vehicles.size());
        BigDecimal total = BigDecimal.ZERO;
        for (Vehicle vehicle : vehicles) {
            total = total.add(vehicle.getPrice());
        }
        cart.setPrice(total);
    }
}
