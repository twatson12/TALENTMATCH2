package com.talentmatch2.Models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.google.cloud.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Opportunity {
    private String Description;        // Match Firebase field
    private String EntertainerID;      // Match Firebase field, assuming it's a String reference path
    private Timestamp Deadline;        // Match Firebase field
    private String MultiMedia;         // Match Firebase field
    private String Title;              // Match Firebase field
    private Timestamp PostDate;        // Match Firebase field
}
