package com.lebronJamesCars.controller;

import com.lebronJamesCars.entity.Review;
import com.lebronJamesCars.service.ReviewService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Review> addReview(
            @PathVariable Long userId,
            @PathVariable Long vehicleId,
            @RequestBody Review review) {
        Review savedReview = reviewService.addReview(userId, vehicleId, review.getRating(), review.getComment());
        return ResponseEntity.ok(savedReview);
    }


    @GetMapping
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(reviewService.getReviewsByVehicle(vehicleId));
    }
}
