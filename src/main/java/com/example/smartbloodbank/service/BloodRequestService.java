package com.example.smartbloodbank.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.smartbloodbank.entity.BloodRequest;
import com.example.smartbloodbank.repository.BloodRequestRepository;

@Service
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository repository;

    // Add blood request
    public BloodRequest addRequest(BloodRequest request) {
        return repository.save(request);
    }

    // Get all blood requests
    public List<BloodRequest> getAllRequests() {
        return repository.findAll();
    }

    // Get request by ID
    public BloodRequest getRequestById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update blood request
    public BloodRequest updateRequest(Long id, BloodRequest request) {

        BloodRequest existingRequest = repository.findById(id).orElse(null);

        if (existingRequest != null) {

            existingRequest.setPatientName(request.getPatientName());
            existingRequest.setHospitalName(request.getHospitalName());
            existingRequest.setBloodGroup(request.getBloodGroup());
            existingRequest.setUnitsRequired(request.getUnitsRequired());
            existingRequest.setRequestDate(request.getRequestDate());
            existingRequest.setPriority(request.getPriority());
            existingRequest.setStatus(request.getStatus());

            return repository.save(existingRequest);
        }

        return null;
    }

    // Delete blood request
    public void deleteRequest(Long id) {
        repository.deleteById(id);
    }
}