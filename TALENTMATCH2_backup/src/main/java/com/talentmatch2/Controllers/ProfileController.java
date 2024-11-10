package com.talentmatch2.Controllers;

import com.talentmatch2.Models.Profile; // Assuming there's a Profile model
import com.talentmatch2.Services.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    @Autowired
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // Get all profiles
    @GetMapping
    public List<Profile> getAllProfiles() {
        return profileService.getAllProfiles();
    }

    // Get a single profile by ID
    @GetMapping("/{id}")
    public Profile getProfileById(@PathVariable String id) {
        return profileService.getProfileById(id);
    }


    // Update an existing profile by ID
    @PutMapping("/{id}")
    public String updateProfile(@PathVariable String id, @RequestBody Profile profile) {
        return profileService.updateProfile(id, profile);
    }

    // Delete a profile by ID
    @DeleteMapping("/{id}")
    public void deleteProfile(@PathVariable String id) {
        profileService.deleteProfile(id);
    }
}
