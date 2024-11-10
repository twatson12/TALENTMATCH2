package com.talentmatch2.Services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.talentmatch2.Models.Subscription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class SubscriptionService {

    private final CollectionReference subscriptionCollection;

    @Autowired
    public SubscriptionService(Firestore firestore) {
        this.subscriptionCollection = firestore.collection("Subscription");
    }

    // Save a new Subscription
    public String saveSubscription(Subscription subscription) {
        ApiFuture<DocumentReference> result = subscriptionCollection.add(subscription);
        try {
            return "Subscription saved with ID: " + result.get().getId();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error saving subscription: " + e.getMessage();
        }
    }

    // Get all Subscriptions
    public List<Subscription> getAllSubscriptions() {
        ApiFuture<QuerySnapshot> querySnapshot = subscriptionCollection.get();
        try {
            return querySnapshot.get().toObjects(Subscription.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Get a single Subscription by ID
    public Subscription getSubscriptionById(String id) {
        ApiFuture<DocumentSnapshot> documentSnapshot = subscriptionCollection.document(id).get();
        try {
            return documentSnapshot.get().toObject(Subscription.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Update a Subscription
    public String updateSubscription(String id, Subscription subscription) {
        ApiFuture<WriteResult> result = subscriptionCollection.document(id).set(subscription);
        try {
            return "Subscription updated at: " + result.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error updating subscription: " + e.getMessage();
        }
    }

    // Delete a Subscription
    public String deleteSubscription(String id) {
        ApiFuture<WriteResult> writeResult = subscriptionCollection.document(id).delete();
        try {
            return "Subscription deleted at: " + writeResult.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error deleting subscription: " + e.getMessage();
        }
    }
}
