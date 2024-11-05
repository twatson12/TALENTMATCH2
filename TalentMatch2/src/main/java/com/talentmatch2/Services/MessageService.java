package com.talentmatch2.Services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.talentmatch2.Models.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class MessageService {

    private final CollectionReference messageCollection;

    @Autowired
    public MessageService(Firestore firestore) {
        this.messageCollection = firestore.collection("Message");
    }

    // Save a new Message
    public String saveMessage(Message message) {
        ApiFuture<DocumentReference> result = messageCollection.add(message);
        try {
            return "Message saved with ID: " + result.get().getId();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error saving message: " + e.getMessage();
        }
    }

    // Get all Messages
    public List<Message> getAllMessages() {
        ApiFuture<QuerySnapshot> querySnapshot = messageCollection.get();
        try {
            return querySnapshot.get().toObjects(Message.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Get a single Message by ID
    public Message getMessageById(String id) {
        ApiFuture<DocumentSnapshot> documentSnapshot = messageCollection.document(id).get();
        try {
            return documentSnapshot.get().toObject(Message.class);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Update a Message
    public String updateMessage(String id, Message message) {
        ApiFuture<WriteResult> result = messageCollection.document(id).set(message);
        try {
            return "Message updated at: " + result.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error updating message: " + e.getMessage();
        }
    }

    // Delete a Message
    public String deleteMessage(String id) {
        ApiFuture<WriteResult> writeResult = messageCollection.document(id).delete();
        try {
            return "Message deleted at: " + writeResult.get().getUpdateTime();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error deleting message: " + e.getMessage();
        }
    }
}
