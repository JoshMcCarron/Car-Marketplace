package com.lebronJamesCars.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import com.lebronJamesCars.entity.Cart;
import com.lebronJamesCars.entity.User;
import com.lebronJamesCars.entity.Vehicle;
import com.lebronJamesCars.repository.CartRepository;
import com.lebronJamesCars.repository.UserRepository;
import com.lebronJamesCars.repository.VehicleRepository;

@Service
public class CartService {
	  private final CartRepository cartRepository;
	  private final UserRepository userRepository;
	  private final VehicleRepository vehicleRepository;

	 public CartService(CartRepository cartRepository,UserRepository userRepository,
	                     VehicleRepository vehicleRepository) {
	        this.cartRepository = cartRepository;
	        this.userRepository = userRepository;
	        this.vehicleRepository = vehicleRepository;
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
		
	private void updateCartTotals(Cart cart) {
		List<Vehicle> vehicles = cart.getVehicles();
	    // Update item count
	    cart.setNoItems(vehicles.size());
	    BigDecimal total = BigDecimal.ZERO;
	    for (Vehicle vehicle : vehicles) {
	        total = total.add(vehicle.getPrice());
	    }
	    cart.setPrice(total);
	}
	
	public Cart getCartByUserId(Long userId) {
	    return cartRepository.findByUserUserId(userId)
	            .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));
	}
	
	public Cart addVehicleToCart(Long userId, Long vehicleId) {
		Cart cart = getCartByUserId(userId);
	    Vehicle vehicle = vehicleRepository.findById(vehicleId)
	            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
	    
	    if(!cart.getVehicles().contains(vehicle)) {
	        cart.getVehicles().add(vehicle);
	        updateCartTotals(cart);
	    }
	    return cartRepository.save(cart);
	}
	
	public Cart removeFromCart(Long userId, Long vehicleId) {
		Cart cart = getCartByUserId(userId);
		 Vehicle vehicle = vehicleRepository.findById(vehicleId)
		            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
				
		if(cart.getVehicles().contains(vehicle)) {
			cart.getVehicles().remove(vehicle);
			updateCartTotals(cart);
		}
		return cartRepository.save(cart);
	}

	public void checkout(Long userId) {
	    Cart cart = getCartByUserId(userId);
	    if (cart.getVehicles().isEmpty()) throw new RuntimeException("Cart is empty");
	    boolean paymentApproved = PaymentService.processPayment(cart.getPrice());
	    if (paymentApproved) {
	    	 for (Vehicle vehicle : cart.getVehicles()) {
	             if (vehicle.getStock() > 0) {
	                 vehicle.setStock(vehicle.getStock() - 1);
	                 vehicleRepository.save(vehicle);
	             } else {
	                 throw new RuntimeException("Vehicle " + vehicle.getVehicleID() + " is out of stock");
	             }
	         }
	    	// Clear the cart after successful payment
	        cart.getVehicles().clear();
	        updateCartTotals(cart);
	        cartRepository.save(cart);
	    } else {
	        throw new RuntimeException("Credit Card Authorization Failed");
	    }
	}
	
	
}
