package com.talentmatch2.Services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.talentmatch2.Models.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class RoleService {

    private final CollectionReference roleCollection;

    @Autowired
    public RoleService(Firestore firestore) {
        this.roleCollection = firestore.collection("Role");
    }

    // Save a new Role
    public String saveRole(Role role) {
        ApiFuture<DocumentReference> result = roleCollection.add(role);
        try {
            return "Role saved with ID: " + result.get().getId();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error saving role: " + e.getMessage();
        }
    }

    // Get all Roles
    public List<Role> getAllRoles() {
        ApiFuture<QuerySnapshot> querySnapshot = roleCollection.get();
        try {
            return querySnapshot.get().toObjects(Role.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Get a single Role by ID
    public Role getRoleById(String id) {
        ApiFuture<DocumentSnapshot> documentSnapshot = roleCollection.document(id).get();
        try {
            return documentSnapshot.get().toObject(Role.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Update a Role
    public String updateRole(String id, Role role) {
        ApiFuture<WriteResult> result = roleCollection.document(id).set(role);
        try {
            return "Role updated at: " + result.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error updating role: " + e.getMessage();
        }
    }

    // Delete a Role
    public String deleteRole(String id) {
        ApiFuture<WriteResult> writeResult = roleCollection.document(id).delete();
        try {
            return "Role deleted at: " + writeResult.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error deleting role: " + e.getMessage();
        }
    }
}
