
package com.example.smartbloodbank.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.smartbloodbank.service.DonorEligibilityService;

@RestController
public class DonorEligibilityController {

    @Autowired
    private DonorEligibilityService service;

    @GetMapping("/donor-eligibility")
    public String checkEligibility(
            @RequestParam int age,
            @RequestParam String gender,
            @RequestParam(required = false)
            String lastDonationDate) {

        return service.checkEligibility(
                age, gender, lastDonationDate);
    }
}
