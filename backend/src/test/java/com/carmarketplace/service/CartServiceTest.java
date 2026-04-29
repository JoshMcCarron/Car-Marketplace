package com.carmarketplace.service;

import com.carmarketplace.TestDataFactory;
import com.carmarketplace.entity.Cart;
import com.carmarketplace.entity.Order;
import com.carmarketplace.entity.User;
import com.carmarketplace.entity.Vehicle;
import com.carmarketplace.exception.BadRequestException;
import com.carmarketplace.exception.ResourceNotFoundException;
import com.carmarketplace.repository.CartRepository;
import com.carmarketplace.repository.OrderRepository;
import com.carmarketplace.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock private CartRepository cartRepository;
    @Mock private VehicleRepository vehicleRepository;
    @Mock private PaymentService paymentService;
    @Mock private OrderRepository orderRepository;

    @InjectMocks private CartService cartService;

    private User user;
    private Cart cart;
    private Vehicle vehicle;

    @BeforeEach
    void setUp() {
        user = TestDataFactory.buildUser("alice@example.com", "USER");
        user.setUserId(1L);

        // TestDataFactory.buildUser calls new User(), which calls new Cart() and links it.
        // We use that cart directly so the user/cart relationship is consistent.
        cart = user.getCart();

        vehicle = TestDataFactory.buildVehicle("Toyota", 5);
        vehicle.setVehicleID(10L);
    }

    // --- addVehicleToCart ---

    @Test
    @DisplayName("addVehicleToCart: adds vehicle and saves cart when vehicle exists and is not already in cart")
    void addVehicleToCart_addsAndSaves_whenVehicleExists() {
        when(cartRepository.findByUserUserId(1L)).thenReturn(Optional.of(cart));
        when(vehicleRepository.findById(10L)).thenReturn(Optional.of(vehicle));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        Cart result = cartService.addVehicleToCart(1L, 10L);

        assertThat(result.getVehicles()).contains(vehicle);
        verify(cartRepository).save(cart);
    }

    @Test
    @DisplayName("addVehicleToCart: throws ResourceNotFoundException when vehicle does not exist")
    void addVehicleToCart_throwsResourceNotFound_whenVehicleNotFound() {
        when(cartRepository.findByUserUserId(1L)).thenReturn(Optional.of(cart));
        when(vehicleRepository.findById(10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.addVehicleToCart(1L, 10L))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(cartRepository, never()).save(any());
    }

    // --- removeFromCart ---

    @Test
    @DisplayName("removeFromCart: removes vehicle and saves cart when vehicle is in cart")
    void removeFromCart_removesAndSaves_whenVehicleInCart() {
        cart.getVehicles().add(vehicle);
        when(cartRepository.findByUserUserId(1L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        Cart result = cartService.removeFromCart(1L, 10L);

        assertThat(result.getVehicles()).doesNotContain(vehicle);
        verify(cartRepository).save(cart);
    }

    // --- checkout ---

    @Test
    @DisplayName("checkout: decrements stock, saves order, and clears cart on success")
    void checkout_decrementsStockAndClearsCart_onSuccess() {
        cart.getVehicles().add(vehicle);
        cart.setPrice(vehicle.getPrice()); // mirror what updateCartTotals() would set after addVehicleToCart
        when(cartRepository.findByUserUserId(1L)).thenReturn(Optional.of(cart));
        when(paymentService.processPayment(any())).thenReturn(true);
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);
        ArgumentCaptor<Cart> cartCaptor = ArgumentCaptor.forClass(Cart.class);
        when(cartRepository.save(cartCaptor.capture())).thenReturn(cart);
        ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);

        cartService.checkout(1L);

        assertThat(vehicle.getStock()).isEqualTo(4); // decremented from 5
        assertThat(cartCaptor.getValue().getVehicles()).isEmpty();

        verify(orderRepository).save(orderCaptor.capture());
        Order savedOrder = orderCaptor.getValue();
        assertThat(savedOrder.getVehicles()).containsExactly(vehicle);
        assertThat(savedOrder.getTotalPrice()).isEqualByComparingTo(vehicle.getPrice());
        assertThat(savedOrder.getStatus()).isEqualTo("COMPLETED");
        assertThat(savedOrder.getUser()).isEqualTo(user);
    }

    @Test
    @DisplayName("checkout: throws BadRequestException when cart is empty")
    void checkout_throwsBadRequest_whenCartEmpty() {
        // cart.getVehicles() is an empty ArrayList (initialized in Cart constructor)
        when(cartRepository.findByUserUserId(1L)).thenReturn(Optional.of(cart));

        assertThatThrownBy(() -> cartService.checkout(1L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("empty");
    }

    @Test
    @DisplayName("checkout: throws BadRequestException when payment is declined, order is not saved")
    void checkout_throwsBadRequest_whenPaymentFails() {
        cart.getVehicles().add(vehicle);
        when(cartRepository.findByUserUserId(1L)).thenReturn(Optional.of(cart));
        when(paymentService.processPayment(any())).thenReturn(false);

        assertThatThrownBy(() -> cartService.checkout(1L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Credit card");
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("checkout: throws BadRequestException when a vehicle is out of stock WITHOUT calling payment or saving an order")
    void checkout_throwsBadRequest_whenVehicleOutOfStock() {
        Vehicle outOfStock = TestDataFactory.buildVehicle("Honda", 0);
        outOfStock.setVehicleID(11L);
        cart.getVehicles().add(outOfStock);

        when(cartRepository.findByUserUserId(1L)).thenReturn(Optional.of(cart));

        assertThatThrownBy(() -> cartService.checkout(1L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("out of stock");

        verify(paymentService, never()).processPayment(any());
        verify(orderRepository, never()).save(any());
    }
}
