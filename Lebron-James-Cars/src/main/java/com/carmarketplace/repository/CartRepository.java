package com.lebronJamesCars.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lebronJamesCars.entity.Cart;
import com.lebronJamesCars.entity.User;

public interface CartRepository extends JpaRepository<Cart, Long>{

	Optional<Cart> findByUserUserId(Long userId);
	
}