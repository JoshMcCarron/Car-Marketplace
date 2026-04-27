package com.carmarketplace.repository;

import com.carmarketplace.entity.Review;
import com.carmarketplace.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByVehicle(Vehicle vehicle);
}
