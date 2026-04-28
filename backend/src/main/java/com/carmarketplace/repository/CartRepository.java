package com.carmarketplace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.carmarketplace.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {

    // JOIN FETCH vehicles in the same query so the collection is initialized before
    // the Hibernate session closes and Jackson serializes the response.
    @EntityGraph(attributePaths = "vehicles")
    Optional<Cart> findByUserUserId(Long userId);

    // Override the inherited findById so getCartById and updateCart
    // also fetch vehicles eagerly without changing the entity's FetchType.
    @EntityGraph(attributePaths = "vehicles")
    @Override
    Optional<Cart> findById(Long id);
}