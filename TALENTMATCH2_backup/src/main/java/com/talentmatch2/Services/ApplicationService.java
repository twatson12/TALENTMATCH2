package com.talentmatch2.Services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.talentmatch2.Models.Application;
import com.talentmatch2.Models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.concurrent.ExecutionException;
import java.util.List;

@Service
public class ApplicationService {

    private final CollectionReference applicationCollection;

    @Autowired
    public ApplicationService(Firestore firestore) {
        this.applicationCollection = firestore.collection("Application");
    }

    // Save a new User
    public String saveApplication(Application application) {
        ApiFuture<DocumentReference> result = applicationCollection.add(application);
        try {
            return "Application saved with ID: " + result.get().getId();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error saving application: " + e.getMessage();
        }
    }

    // Get all Users
    public List<Application> getAllApplications() {
        ApiFuture<QuerySnapshot> querySnapshot = applicationCollection.get();
        try {
            return querySnapshot.get().toObjects(Application.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }


    // Get a single User by ID
    public Application getApplicationById(String id) {
        ApiFuture<DocumentSnapshot> documentSnapshot = applicationCollection.document(id).get();
        try {
            return documentSnapshot.get().toObject(Application.class);

        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Update a User
    public String updateApplication(String id, Application application) {
        ApiFuture<WriteResult> result = applicationCollection.document(id).set(application);
        try {
            return "Application updated at: " + result.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error updating application: " + e.getMessage();
        }
    }

    // Delete a User
    public String deleteApplication(String id) {
        ApiFuture<WriteResult> writeResult = applicationCollection.document(id).delete();
        try {
            return "Application deleted at: " + writeResult.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error deleting application: " + e.getMessage();
        }
    }
}
/*
    @Autowired
    public ApplicationService(Firestore firestore) {
        this.applicationCollection = firestore.collection("Application");
    }

    public String saveApplication(Application application) {
        ApiFuture<DocumentReference> result = applicationCollection.add(application);
        try {
            return "Application saved with ID: " + result.get().getId();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error saving application: " + e.getMessage();
        }
    }

    public List<Application> getAllApplications() {
        ApiFuture<QuerySnapshot> querySnapshot = applicationCollection.get();

        try {
            return querySnapshot.get().toObjects(Application.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Application getApplicationById(String id) {
        ApiFuture<DocumentSnapshot> documentSnapshot = applicationCollection.document(id).get();
        try {
            return documentSnapshot.get().toObject(Application.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String updateApplication(String id, Application application) {
        ApiFuture<WriteResult> result = applicationCollection.document(id).set(application);
        try {
            return "Application updated at: " + result.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error updating application: " + e.getMessage();
        }
    }

    public String deleteApplication(String id) {
        ApiFuture<WriteResult> writeResult = applicationCollection.document(id).delete();
        try {
            return "Application deleted at: " + writeResult.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error deleting application: " + e.getMessage();
        }
    }

 */



