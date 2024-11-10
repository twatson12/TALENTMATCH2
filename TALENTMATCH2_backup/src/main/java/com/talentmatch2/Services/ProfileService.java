package com.talentmatch2.Services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.talentmatch2.Models.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ProfileService {

    private final CollectionReference profileCollection;

    @Autowired
    public ProfileService(Firestore firestore) {
        this.profileCollection = firestore.collection("Profile");
    }

    // Save a new Profile
    public String saveProfile(Profile profile) {
        ApiFuture<DocumentReference> result = profileCollection.add(profile);
        try {
            return "Profile saved with ID: " + result.get().getId();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error saving profile: " + e.getMessage();
        }
    }

    // Get all Profiles
    public List<Profile> getAllProfiles() {
        ApiFuture<QuerySnapshot> querySnapshot = profileCollection.get();
        try {
            return querySnapshot.get().toObjects(Profile.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Get a single Profile by ID
    public Profile getProfileById(String id) {
        ApiFuture<DocumentSnapshot> documentSnapshot = profileCollection.document(id).get();
        try {
            return documentSnapshot.get().toObject(Profile.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Update a Profile
    public String updateProfile(String id, Profile profile) {
        ApiFuture<WriteResult> result = profileCollection.document(id).set(profile);
        try {
            return "Profile updated at: " + result.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error updating profile: " + e.getMessage();
        }
    }

    // Delete a Profile
    public String deleteProfile(String id) {
        ApiFuture<WriteResult> writeResult = profileCollection.document(id).delete();
        try {
            return "Profile deleted at: " + writeResult.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error deleting profile: " + e.getMessage();
        }
    }
}
