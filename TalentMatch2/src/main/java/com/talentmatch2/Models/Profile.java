package com.talentmatch2.Models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.google.cloud.firestore.DocumentReference;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    private String Portfolio;
    private List<String> Skills;
    private DocumentReference userID;

}
