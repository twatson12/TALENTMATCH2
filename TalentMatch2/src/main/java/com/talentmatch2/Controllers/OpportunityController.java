package com.talentmatch2.Controllers;

import com.talentmatch2.Models.Opportunity;
import com.talentmatch2.Services.OpportunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final OpportunityService opportunityService;

    @Autowired
    public OpportunityController(OpportunityService opportunityService) {
        this.opportunityService = opportunityService;
    }

    // Create a new Opportunity
    @PostMapping
    public ResponseEntity<String> createOpportunity(@RequestBody Opportunity opportunity) {
        String result = opportunityService.saveOpportunity(opportunity);
        return ResponseEntity.ok(result);
    }

    // Get all Opportunities
    @GetMapping
    public ResponseEntity<List<Opportunity>> getAllOpportunities() {
        List<Opportunity> opportunities = opportunityService.getAllOpportunities();
        return ResponseEntity.ok(opportunities);
    }

    // Get an Opportunity by ID
    @GetMapping("/{id}")
    public ResponseEntity<Opportunity> getOpportunityById(@PathVariable String id) {
        Opportunity opportunity = opportunityService.getOpportunityById(id);
        if (opportunity != null) {
            return ResponseEntity.ok(opportunity);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update an Opportunity
    @PutMapping("/{id}")
    public ResponseEntity<String> updateOpportunity(@PathVariable String id, @RequestBody Opportunity opportunity) {
        String result = opportunityService.updateOpportunity(id, opportunity);
        return ResponseEntity.ok(result);
    }

    // Delete an Opportunity
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOpportunity(@PathVariable String id) {
        String result = opportunityService.deleteOpportunity(id);
        return ResponseEntity.ok(result);
    }
}
