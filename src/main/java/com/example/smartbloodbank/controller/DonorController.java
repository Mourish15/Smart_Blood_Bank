package com.example.smartbloodbank.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.smartbloodbank.entity.Donor;
import com.example.smartbloodbank.service.DonorService;

@RestController
@RequestMapping("/donors")
public class DonorController {

    @Autowired
    private DonorService service;

    // Add donor
    @PostMapping
    public Donor addDonor(@RequestBody Donor donor) {
        return service.addDonor(donor);
    }

    // Get all donors
    @GetMapping
    public List<Donor> getAllDonors() {
        return service.getAllDonors();
    }

    // Get donor by ID
    @GetMapping("/{id}")
    public Donor getDonorById(@PathVariable Long id) {
        return service.getDonorById(id);
    }

    // Update donor
    @PutMapping("/{id}")
    public Donor updateDonor(
            @PathVariable Long id,
            @RequestBody Donor donor) {

        return service.updateDonor(id, donor);
    }

    // Delete donor
    @DeleteMapping("/{id}")
    public String deleteDonor(@PathVariable Long id) {

        service.deleteDonor(id);

        return "Donor deleted successfully";
    }
}