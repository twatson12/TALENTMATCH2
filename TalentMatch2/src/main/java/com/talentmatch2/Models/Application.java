package com.talentmatch2.Models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.google.cloud.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {
    private String opportunityID; // Matches 'OpportunityID' field in Firebase
    private String status; // Matches 'Status' field in Firebase
    private Timestamp submissionDate; // Matches 'SubmissionDate' field in Firebase
    private String talentID; // Matches 'TalentID' field in Firebase
}
