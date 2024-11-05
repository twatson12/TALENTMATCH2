package com.talentmatch2.Models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.google.cloud.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String email;
    private String fname;
    private String lname;
    private String password;
    private Timestamp registrationDate;
    private String roleId; // Assuming this is a reference to a Role document
    private String subscriptionPlanId; // Assuming this is a reference to a Subscription document
}
