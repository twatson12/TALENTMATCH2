package com.talentmatch2.Models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    private String Comment;    // Match Firebase field
    private String Rating;     // Match Firebase field
    private String UserID;     // Match Firebase field, assuming it's a String reference path
}
