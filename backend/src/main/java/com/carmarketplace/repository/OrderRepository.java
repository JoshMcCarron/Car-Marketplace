package com.carmarketplace.repository;

import com.carmarketplace.entity.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = "vehicles")
    List<Order> findByUserUserId(Long userId);

    @EntityGraph(attributePaths = "vehicles")
    Optional<Order> findByOrderIdAndUserUserId(Long orderId, Long userId);
}
