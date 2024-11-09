package com.talentmatch2.Models;

import com.google.cloud.firestore.DocumentReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.google.cloud.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {
    private DocumentReference OpportunityID; // Matches 'OpportunityID' field in Firebase
    private String Status; // Matches 'Status' field in Firebase
    private Timestamp SubmissionDate; // Matches 'SubmissionDate' field in Firebase
    private DocumentReference TalentID; // Matches 'TalentID' field in Firebase
}
