package com.talentmatch2.Models;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.annotation.DocumentId;
import com.google.protobuf.util.Timestamps;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.google.cloud.Timestamp;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String Email;
    private String Fname;
    private String Lname;
    private String Password;
    private Timestamp registrationDate;
    private DocumentReference RoleId; // Assuming this is a reference to a Role document
    private DocumentReference SubscriptionPlanId; // Assuming this is a reference to a Subscription document


   // public void setRegistationDate(String registrationDate ) throws ParseException
   // {

   //     this.registrationDate = Timestamp.fromProto(Timestamps.parse(registrationDate));
    //}


}
