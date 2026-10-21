
package com.example.smartbloodbank.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.smartbloodbank.service.BloodCompatibilityService;

@RestController
public class BloodCompatibilityController {

    @Autowired
    private BloodCompatibilityService service;

    @GetMapping("/blood-compatibility")
    public String checkCompatibility(
            @RequestParam String donor,
            @RequestParam String recipient) {

        boolean compatible =
                service.isCompatible(donor, recipient);

        if (compatible) {
            return "Compatible: " + donor + " blood group can donate red blood cells to " + recipient + ".";
        } else {
            return "Not compatible: " + donor + " blood group cannot donate red blood cells to " + recipient + ".";
        }
    }
}

