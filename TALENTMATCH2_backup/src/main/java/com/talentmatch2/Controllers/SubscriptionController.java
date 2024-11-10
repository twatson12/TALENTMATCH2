package com.talentmatch2.Controllers;

import com.talentmatch2.Models.Subscription;
import com.talentmatch2.Services.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @Autowired
    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    // Create a new subscription
    @PostMapping
    public String saveSubscription(@RequestBody Subscription subscription) {
        return subscriptionService.saveSubscription(subscription);
    }

    // Get all subscriptions
    @GetMapping
    public List<Subscription> getAllSubscriptions() {
        return subscriptionService.getAllSubscriptions();
    }

    // Get a subscription by ID
    @GetMapping("/{id}")
    public Subscription getSubscriptionById(@PathVariable String id) {
        return subscriptionService.getSubscriptionById(id);
    }

    // Update a subscription by ID
    @PutMapping("/{id}")
    public String updateSubscription(@PathVariable String id, @RequestBody Subscription subscription) {
        return subscriptionService.updateSubscription(id, subscription);
    }

    // Delete a subscription by ID
    @DeleteMapping("/{id}")
    public String deleteSubscription(@PathVariable String id) {
        return subscriptionService.deleteSubscription(id);
    }
}
