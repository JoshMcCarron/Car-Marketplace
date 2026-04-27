package com.carmarketplace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.carmarketplace.entity.User;



public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

