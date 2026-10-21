package com.example.smartbloodbank.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.smartbloodbank.entity.Donor;
import com.example.smartbloodbank.repository.DonorRepository;

@Service
public class DonorService {

    @Autowired
    private DonorRepository repository;

    // Add donor
    public Donor addDonor(Donor donor) {
        return repository.save(donor);
    }

    // Get all donors
    public List<Donor> getAllDonors() {
        return repository.findAll();
    }

    // Get donor by ID
    public Donor getDonorById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update donor
    public Donor updateDonor(Long id, Donor donor) {

        Donor existingDonor = repository.findById(id).orElse(null);

        if (existingDonor != null) {

            existingDonor.setName(donor.getName());
            existingDonor.setAge(donor.getAge());
            existingDonor.setGender(donor.getGender());
            existingDonor.setBloodGroup(donor.getBloodGroup());
            existingDonor.setPhone(donor.getPhone());
            existingDonor.setEmail(donor.getEmail());
            existingDonor.setAddress(donor.getAddress());
            existingDonor.setLastDonationDate(donor.getLastDonationDate());
            existingDonor.setEligible(donor.isEligible());

            return repository.save(existingDonor);
        }

        return null;
    }

    // Delete donor
    public void deleteDonor(Long id) {
        repository.deleteById(id);
    }
}