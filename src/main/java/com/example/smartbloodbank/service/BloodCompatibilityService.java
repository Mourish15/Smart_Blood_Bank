
package com.example.smartbloodbank.service;

import org.springframework.stereotype.Service;

@Service
public class BloodCompatibilityService {

    public boolean isCompatible(
            String donorBloodGroup,
            String recipientBloodGroup) {

        if (donorBloodGroup == null || recipientBloodGroup == null) {
            return false;
        }

        donorBloodGroup = donorBloodGroup.trim().toUpperCase();
        recipientBloodGroup = recipientBloodGroup.trim().toUpperCase();

        switch (donorBloodGroup) {

            case "O-":
                return true;

            case "O+":
                return recipientBloodGroup.equals("O+")
                        || recipientBloodGroup.equals("A+")
                        || recipientBloodGroup.equals("B+")
                        || recipientBloodGroup.equals("AB+");

            case "A-":
                return recipientBloodGroup.equals("A-")
                        || recipientBloodGroup.equals("A+")
                        || recipientBloodGroup.equals("AB-")
                        || recipientBloodGroup.equals("AB+");

            case "A+":
                return recipientBloodGroup.equals("A+")
                        || recipientBloodGroup.equals("AB+");

            case "B-":
                return recipientBloodGroup.equals("B-")
                        || recipientBloodGroup.equals("B+")
                        || recipientBloodGroup.equals("AB-")
                        || recipientBloodGroup.equals("AB+");

            case "B+":
                return recipientBloodGroup.equals("B+")
                        || recipientBloodGroup.equals("AB+");

            case "AB-":
                return recipientBloodGroup.equals("AB-")
                        || recipientBloodGroup.equals("AB+");

            case "AB+":
                return recipientBloodGroup.equals("AB+");

            default:
                return false;
        }
    }
}
