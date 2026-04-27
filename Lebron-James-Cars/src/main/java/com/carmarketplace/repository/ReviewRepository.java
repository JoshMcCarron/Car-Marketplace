package com.lebronJamesCars.repository;

import com.lebronJamesCars.entity.Review;
import com.lebronJamesCars.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByVehicle(Vehicle vehicle);
}
