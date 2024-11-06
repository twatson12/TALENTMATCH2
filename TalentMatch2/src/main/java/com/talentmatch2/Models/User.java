package com.talentmatch2.Models;

import com.google.protobuf.util.Timestamps;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.google.cloud.Timestamp;

import java.text.ParseException;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String Email;
    private String Fname;
    private String Lname;
    private String Password;
    private Timestamp registrationDate;
    private String roleId; // Assuming this is a reference to a Role document
    private String subscriptionPlanId; // Assuming this is a reference to a Subscription document

}
