package com.talentmatch2.Models;

import com.google.cloud.firestore.DocumentReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.google.cloud.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Opportunity {
    private String Description;        // Match Firebase field
    private DocumentReference entertainerID;      // Match Firebase field, assuming it's a String reference path
    private String deadline;        // Match Firebase field
    private String MultiMedia;         // Match Firebase field
    private String Title;              // Match Firebase field
    private String postDate;        // Match Firebase field
}
