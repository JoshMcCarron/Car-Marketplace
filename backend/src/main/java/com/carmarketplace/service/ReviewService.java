package com.carmarketplace.service;

import com.carmarketplace.entity.Review;
import com.carmarketplace.entity.User;
import com.carmarketplace.entity.Vehicle;
import com.carmarketplace.exception.ResourceNotFoundException;
import com.carmarketplace.repository.ReviewRepository;
import com.carmarketplace.repository.UserRepository;
import com.carmarketplace.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository,
                         VehicleRepository vehicleRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public Review addReview(Long userId, Long vehicleId, int rating, String comment) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + vehicleId));

        return reviewRepository.save(new Review(user, vehicle, rating, comment));
    }

    public List<Review> getReviewsByVehicle(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + vehicleId));
        return reviewRepository.findByVehicle(vehicle);
    }
}
