package com.talentmatch2.Controllers;

import com.talentmatch2.Models.Application;
import com.talentmatch2.Services.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;


    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // Create a new user
    @PostMapping
    public String saveApplication(@RequestBody Application application) {
        return applicationService.saveApplication(application);
    }

    // Get all users
    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    // Get a user by ID
    @GetMapping("/{id}")
    public Application getApplicationsById(@PathVariable String id) {
        return applicationService.getApplicationById(id);
    }

    // Update a user by ID
    @PutMapping("/{id}")
    public String updateApplication(@PathVariable String id, @RequestBody Application application) {
        return applicationService.updateApplication(id, application);
    }

    // Delete a user by ID
    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable String id) {
        return applicationService.deleteApplication(id);
    }
/*
    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public String createApplication(@RequestBody Application application) {
        //String result = applicationService.saveApplication(application);
        //return ResponseEntity.ok(result);
        return applicationService.saveApplication(application);
    }

    @GetMapping
    public List<Application> getAllApplications() {
      //  List<Application> applications = applicationService.getAllApplications();
       // return ResponseEntity.ok(applications);
        return applicationService.getAllApplications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable String id) {
        Application application = applicationService.getApplicationById(id);
        if (application != null) {
            return ResponseEntity.ok(application);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateApplication(@PathVariable String id, @RequestBody Application application) {
        String result = applicationService.updateApplication(id, application);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteApplication(@PathVariable String id) {
        String result = applicationService.deleteApplication(id);
        return ResponseEntity.ok(result);
    }

 */
}
