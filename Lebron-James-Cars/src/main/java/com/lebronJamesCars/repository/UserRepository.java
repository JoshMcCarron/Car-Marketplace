package com.lebronJamesCars.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lebronJamesCars.entity.User;



public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

