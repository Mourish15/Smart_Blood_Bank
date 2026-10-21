package com.example.smartbloodbank.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smartbloodbank.entity.BloodRequest;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

}