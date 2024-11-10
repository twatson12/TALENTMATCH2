package com.talentmatch2.Models;

import com.google.cloud.firestore.DocumentReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.google.cloud.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private String MessageText;   // Match Firebase field
    private String SenderID;      // Match Firebase field, assuming it's a String reference
    private Timestamp timestamp;  // Match Firebase field
}
