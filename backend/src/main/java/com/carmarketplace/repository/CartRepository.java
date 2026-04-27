package com.carmarketplace.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.carmarketplace.entity.Cart;
import com.carmarketplace.entity.User;

public interface CartRepository extends JpaRepository<Cart, Long>{

	Optional<Cart> findByUserUserId(Long userId);
	
}