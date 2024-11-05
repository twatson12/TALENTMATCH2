package com.talentmatch2.Services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.talentmatch2.Models.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ReviewService {

    private final CollectionReference reviewCollection;

    @Autowired
    public ReviewService(Firestore firestore) {
        this.reviewCollection = firestore.collection("Review");
    }

    // Save a new Review
    public String saveReview(Review review) {
        ApiFuture<DocumentReference> result = reviewCollection.add(review);
        try {
            return "Review saved with ID: " + result.get().getId();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error saving review: " + e.getMessage();
        }
    }

    // Get all Reviews
    public List<Review> getAllReviews() {
        ApiFuture<QuerySnapshot> querySnapshot = reviewCollection.get();
        try {
            return querySnapshot.get().toObjects(Review.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Get a single Review by ID
    public Review getReviewById(String id) {
        ApiFuture<DocumentSnapshot> documentSnapshot = reviewCollection.document(id).get();
        try {
            return documentSnapshot.get().toObject(Review.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Update a Review
    public String updateReview(String id, Review review) {
        ApiFuture<WriteResult> result = reviewCollection.document(id).set(review);
        try {
            return "Review updated at: " + result.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error updating review: " + e.getMessage();
        }
    }

    // Delete a Review
    public String deleteReview(String id) {
        ApiFuture<WriteResult> writeResult = reviewCollection.document(id).delete();
        try {
            return "Review deleted at: " + writeResult.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error deleting review: " + e.getMessage();
        }
    }
}
