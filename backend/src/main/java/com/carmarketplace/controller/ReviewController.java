package com.carmarketplace.controller;

import com.carmarketplace.entity.Review;
import com.carmarketplace.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicles/{vehicleId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(#userId, authentication)")
    public ResponseEntity<Review> addReview(
            @PathVariable Long userId,
            @PathVariable Long vehicleId,
            @RequestBody Review review) {
        Review saved = reviewService.addReview(userId, vehicleId, review.getRating(), review.getComment());
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(reviewService.getReviewsByVehicle(vehicleId));
    }
}
