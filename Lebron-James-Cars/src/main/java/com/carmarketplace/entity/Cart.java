package com.lebronJamesCars.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "cart")

public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long CartId;
    // Will be a list of vehicles
    @OneToOne
    @JoinColumn(name = "user_id") // Foreign key to User
    @JsonIgnore
    private User user;

    @ManyToMany
    @JoinTable(
            name = "cart_vehicle",
            joinColumns = @JoinColumn(name = "cart_id"),
            inverseJoinColumns = @JoinColumn(name = "vehicle_id")
    )
    private List<Vehicle> vehicles;
    @Column(name = "price", nullable = false)
    private BigDecimal price;
    private int noItems;
    
    public Cart() {
        this.price = BigDecimal.ZERO;
        this.noItems = 0;
    }


    public Long getCartId() {
        return CartId;
    }

    public void setCartId(Long cartId) {
        CartId = cartId;
    }

    public List<Vehicle> getVehicles() {
        return vehicles;
    }

    public void setVehicles(List<Vehicle> vehicles) {
        this.vehicles = vehicles;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal total) {
        this.price = total;
    }

    public int getNoItems() {
        return noItems;
    }

    public void setNoItems(int noItems) {
        this.noItems = noItems;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
