package com.talentmatch2.Models;

import com.google.cloud.firestore.DocumentReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    private String Comment;    // Match Firebase field
    private String Rating;     // Match Firebase field
    private DocumentReference userID;     // Match Firebase field, assuming it's a String reference path
}
