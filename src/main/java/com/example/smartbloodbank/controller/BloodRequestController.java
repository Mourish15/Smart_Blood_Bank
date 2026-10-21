package com.example.smartbloodbank.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.smartbloodbank.entity.BloodRequest;
import com.example.smartbloodbank.service.BloodRequestService;

@RestController
@RequestMapping("/bloodrequests")
public class BloodRequestController {

    @Autowired
    private BloodRequestService service;

    // Add blood request
    @PostMapping
    public BloodRequest addRequest(@RequestBody BloodRequest request) {
        return service.addRequest(request);
    }

    // Get all blood requests
    @GetMapping
    public List<BloodRequest> getAllRequests() {
        return service.getAllRequests();
    }

    // Get request by ID
    @GetMapping("/{id}")
    public BloodRequest getRequestById(@PathVariable Long id) {
        return service.getRequestById(id);
    }

    // Update blood request
    @PutMapping("/{id}")
    public BloodRequest updateRequest(
            @PathVariable Long id,
            @RequestBody BloodRequest request) {

        return service.updateRequest(id, request);
    }

    // Delete blood request
    @DeleteMapping("/{id}")
    public String deleteRequest(@PathVariable Long id) {

        service.deleteRequest(id);

        return "Blood request deleted successfully";
    }
}