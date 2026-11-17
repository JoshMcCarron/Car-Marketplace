package com.carmarketplace.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carmarketplace.entity.Cart;
import com.carmarketplace.entity.Order;
import com.carmarketplace.entity.Vehicle;
import com.carmarketplace.exception.BadRequestException;
import com.carmarketplace.exception.ResourceNotFoundException;
import com.carmarketplace.repository.CartRepository;
import com.carmarketplace.repository.OrderRepository;
import com.carmarketplace.repository.VehicleRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final VehicleRepository vehicleRepository;
    private final PaymentService paymentService;
    private final OrderRepository orderRepository;

    public CartService(CartRepository cartRepository, VehicleRepository vehicleRepository,
                       PaymentService paymentService, OrderRepository orderRepository) {
        this.cartRepository = cartRepository;
        this.vehicleRepository = vehicleRepository;
        this.paymentService = paymentService;
        this.orderRepository = orderRepository;
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
        boolean alreadyInCart = cart.getVehicles().stream()
                .anyMatch(v -> v.getVehicleID().equals(vehicleId));
        if (!alreadyInCart) {
            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + vehicleId));
            cart.getVehicles().add(vehicle);
            updateCartTotals(cart);
        }
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(Long userId, Long vehicleId) {
        Cart cart = getCartByUserId(userId);
        boolean removed = cart.getVehicles().removeIf(v -> v.getVehicleID().equals(vehicleId));
        if (removed) {
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

        // Reserve one unit of each vehicle with an atomic conditional UPDATE. Under concurrent
        // checkouts only as many buyers as there are units succeed; the rest get "out of stock".
        // Vehicles are reserved in ID order so two carts can't lock rows in opposite orders.
        List<Vehicle> purchased = new ArrayList<>(cart.getVehicles());
        purchased.sort(Comparator.comparing(Vehicle::getVehicleID));
        for (Vehicle vehicle : purchased) {
            if (vehicleRepository.decrementStockIfAvailable(vehicle.getVehicleID()) == 0) {
                // throwing rolls back any units already reserved in this transaction
                throw new BadRequestException("Vehicle " + vehicle.getVehicleID() + " is out of stock");
            }
        }

        // Charge the total recomputed from current vehicle prices, not the stored cart total.
        BigDecimal total = BigDecimal.ZERO;
        for (Vehicle vehicle : purchased) {
            total = total.add(vehicle.getPrice());
        }
        if (!paymentService.processPayment(total)) {
            throw new BadRequestException("Credit card authorization failed");
        }

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setVehicles(purchased);
        order.setTotalPrice(total);
        orderRepository.save(order);

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
