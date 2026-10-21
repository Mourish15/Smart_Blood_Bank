
package com.example.smartbloodbank.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;

@Service
public class DonorEligibilityService {

    public String checkEligibility(
            int age,
            String gender,
            String lastDonationDate) {

        if (age < 18 || age > 65) {
            return "Not eligible: Age must be between 18 and 65.";
        }

        if (gender == null || gender.isBlank()) {
            return "Please provide the donor's gender.";
        }

        gender = gender.trim();

        long requiredDays;

        if (gender.equalsIgnoreCase("Male")) {
            requiredDays = 90;
        } else if (gender.equalsIgnoreCase("Female")) {
            requiredDays = 120;
        } else {
            return "Please enter Male or Female for this eligibility check.";
        }

        if (lastDonationDate != null
                && !lastDonationDate.isBlank()) {

            try {
                LocalDate lastDate =
                        LocalDate.parse(lastDonationDate.trim());

                LocalDate today = LocalDate.now();

                if (lastDate.isAfter(today)) {
                    return "Invalid last donation date.";
                }

                long daysSinceDonation =
                        ChronoUnit.DAYS.between(lastDate, today);

                if (daysSinceDonation < requiredDays) {
                    long daysRemaining =
                            requiredDays - daysSinceDonation;

                    return "Not eligible yet. Please wait "
                            + daysRemaining + " more days.";
                }

            } catch (java.time.format.DateTimeParseException e) {
                return "Invalid date. Use YYYY-MM-DD format.";
            }
        }

        return "Passes the basic eligibility checks. "
                + "Final eligibility requires professional screening.";
    }
}
