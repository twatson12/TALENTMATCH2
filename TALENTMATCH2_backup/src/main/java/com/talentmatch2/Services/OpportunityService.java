package com.talentmatch2.Services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.talentmatch2.Models.Opportunity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class OpportunityService {

    private final CollectionReference opportunityCollection;

    @Autowired
    public OpportunityService(Firestore firestore) {
        this.opportunityCollection = firestore.collection("Opportunity");
    }

    // Save a new Opportunity
    public String saveOpportunity(Opportunity opportunity) {
        ApiFuture<DocumentReference> result = opportunityCollection.add(opportunity);
        try {
            return "Opportunity saved with ID: " + result.get().getId();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error saving opportunity: " + e.getMessage();
        }
    }

    // Get all Opportunities
    public List<Opportunity> getAllOpportunities() {
        ApiFuture<QuerySnapshot> querySnapshot = opportunityCollection.get();
        try {
            return querySnapshot.get().toObjects(Opportunity.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Get a single Opportunity by ID
    public Opportunity getOpportunityById(String id) {
        ApiFuture<DocumentSnapshot> documentSnapshot = opportunityCollection.document(id).get();
        try {
            return documentSnapshot.get().toObject(Opportunity.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Update an Opportunity
    public String updateOpportunity(String id, Opportunity opportunity) {
        ApiFuture<WriteResult> result = opportunityCollection.document(id).set(opportunity);
        try {
            return "Opportunity updated at: " + result.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error updating opportunity: " + e.getMessage();
        }
    }

    // Delete an Opportunity
    public String deleteOpportunity(String id) {
        ApiFuture<WriteResult> writeResult = opportunityCollection.document(id).delete();
        try {
            return "Opportunity deleted at: " + writeResult.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error deleting opportunity: " + e.getMessage();
        }
    }
}
