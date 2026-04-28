package com.carmarketplace.service;

import com.carmarketplace.TestDataFactory;
import com.carmarketplace.entity.Review;
import com.carmarketplace.entity.User;
import com.carmarketplace.entity.Vehicle;
import com.carmarketplace.exception.ResourceNotFoundException;
import com.carmarketplace.repository.ReviewRepository;
import com.carmarketplace.repository.UserRepository;
import com.carmarketplace.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock private ReviewRepository reviewRepository;
    @Mock private UserRepository userRepository;
    @Mock private VehicleRepository vehicleRepository;

    @InjectMocks private ReviewService reviewService;

    private User user;
    private Vehicle vehicle;

    @BeforeEach
    void setUp() {
        user = TestDataFactory.buildUser("alice@example.com", "USER");
        user.setUserId(1L);

        vehicle = TestDataFactory.buildVehicle("Toyota", 3);
        vehicle.setVehicleID(10L);
    }

    // --- addReview ---

    @Test
    @DisplayName("addReview: saves and returns the review when both user and vehicle exist")
    void addReview_savesAndReturnsReview_whenBothExist() {
        Review saved = TestDataFactory.buildReview(user, vehicle);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(vehicleRepository.findById(10L)).thenReturn(Optional.of(vehicle));
        when(reviewRepository.save(any(Review.class))).thenReturn(saved);

        Review result = reviewService.addReview(1L, 10L, 5, "Great car");

        assertThat(result.getRating()).isEqualTo(5);
        assertThat(result.getComment()).isEqualTo("Great car");
        verify(reviewRepository).save(any(Review.class));
    }

    @Test
    @DisplayName("addReview: throws ResourceNotFoundException when user does not exist")
    void addReview_throwsResourceNotFound_whenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reviewService.addReview(1L, 10L, 5, "Great car"))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(vehicleRepository, never()).findById(any());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("addReview: throws ResourceNotFoundException when vehicle does not exist")
    void addReview_throwsResourceNotFound_whenVehicleNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(vehicleRepository.findById(10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reviewService.addReview(1L, 10L, 5, "Great car"))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(reviewRepository, never()).save(any());
    }

    // --- getReviewsByVehicle ---

    @Test
    @DisplayName("getReviewsByVehicle: returns all reviews for the vehicle when it exists")
    void getReviewsByVehicle_returnsReviews_whenVehicleExists() {
        List<Review> reviews = List.of(
                TestDataFactory.buildReview(user, vehicle),
                TestDataFactory.buildReview(user, vehicle)
        );
        when(vehicleRepository.findById(10L)).thenReturn(Optional.of(vehicle));
        when(reviewRepository.findByVehicle(vehicle)).thenReturn(reviews);

        List<Review> result = reviewService.getReviewsByVehicle(10L);

        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("getReviewsByVehicle: throws ResourceNotFoundException when vehicle does not exist")
    void getReviewsByVehicle_throwsResourceNotFound_whenVehicleNotFound() {
        when(vehicleRepository.findById(10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reviewService.getReviewsByVehicle(10L))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(reviewRepository, never()).findByVehicle(any());
    }
}
