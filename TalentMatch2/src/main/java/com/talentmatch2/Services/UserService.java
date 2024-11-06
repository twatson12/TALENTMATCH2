package com.talentmatch2.Services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.talentmatch2.Models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class UserService {

    private final CollectionReference userCollection;

   @Autowired
    public UserService(Firestore firestore) {
        this.userCollection = firestore.collection("User");
    }

    // Save a new User
    public String saveUser(User user) {
        ApiFuture<DocumentReference> result = userCollection.add(user);
        try {
            return "User saved with ID: " + result.get().getId();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error saving user: " + e.getMessage();
        }
    }

    // Get all Users
    public List<User> getAllUsers() {
        ApiFuture<QuerySnapshot> querySnapshot = userCollection.get();
        try {
            return querySnapshot.get().toObjects(User.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Get a single User by ID
    public User getUserById(String id) {
        ApiFuture<DocumentSnapshot> documentSnapshot = userCollection.document(id).get();
        try {
            return documentSnapshot.get().toObject(User.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Update a User
    public String updateUser(String id, User user) {
        ApiFuture<WriteResult> result = userCollection.document(id).set(user);
        try {
            return "User updated at: " + result.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error updating user: " + e.getMessage();
        }
    }

    // Delete a User
    public String deleteUser(String id) {
        ApiFuture<WriteResult> writeResult = userCollection.document(id).delete();
        try {
            return "User deleted at: " + writeResult.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error deleting user: " + e.getMessage();
        }
    }
}
