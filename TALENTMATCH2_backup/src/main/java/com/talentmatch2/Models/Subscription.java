package com.talentmatch2.Models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {
    private int price; // Matches the 'Price' field in Firebase
    private String subName; // Matches the 'SubName' field in Firebase
}
