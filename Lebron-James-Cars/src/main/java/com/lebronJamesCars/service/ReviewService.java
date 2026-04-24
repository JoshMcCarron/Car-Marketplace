package com.lebronJamesCars.service;

import com.lebronJamesCars.entity.Review;
import com.lebronJamesCars.entity.User;
import com.lebronJamesCars.entity.Vehicle;
import com.lebronJamesCars.repository.ReviewRepository;
import com.lebronJamesCars.repository.UserRepository;
import com.lebronJamesCars.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository, VehicleRepository vehicleRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public Review addReview(Long userId, Long vehicleId, int rating, String comment) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        Review review = new Review(user, vehicle, rating, comment);
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByVehicle(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        return reviewRepository.findByVehicle(vehicle);
    }
}
