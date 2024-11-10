package com.talentmatch2.Controllers;

import com.talentmatch2.Models.Message;
import com.talentmatch2.Services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    // Create a new Message
    @PostMapping
    public ResponseEntity<String> createMessage(@RequestBody Message message) {
        String result = messageService.saveMessage(message);
        return ResponseEntity.ok(result);
    }

    // Get all Messages
    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    // Get a Message by ID
    @GetMapping("/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable String id) {
        Message message = messageService.getMessageById(id);
        return ResponseEntity.ok(message);
    }

    // Update a Message
    @PutMapping("/{id}")
    public ResponseEntity<String> updateMessage(@PathVariable String id, @RequestBody Message message) {
        String result = messageService.updateMessage(id, message);
        return ResponseEntity.ok(result);
    }

    // Delete a Message
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMessage(@PathVariable String id) {
        String result = messageService.deleteMessage(id);
        return ResponseEntity.ok(result);
    }
}
