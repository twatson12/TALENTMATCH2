package com.talentmatch2.Controllers;

import com.talentmatch2.Models.Review;
import com.talentmatch2.Services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Create a new review
    @PostMapping
    public String saveReview(@RequestBody Review review) {
        return reviewService.saveReview(review);
    }

    // Get all reviews
    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    // Get a review by ID
    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable String id) {
        return reviewService.getReviewById(id);
    }

    // Update a review by ID
    @PutMapping("/{id}")
    public String updateReview(@PathVariable String id, @RequestBody Review review) {
        return reviewService.updateReview(id, review);
    }

    // Delete a review by ID
    @DeleteMapping("/{id}")
    public String deleteReview(@PathVariable String id) {
        return reviewService.deleteReview(id);
    }
}
