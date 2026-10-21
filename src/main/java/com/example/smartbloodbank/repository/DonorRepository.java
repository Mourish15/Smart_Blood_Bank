package com.example.smartbloodbank.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smartbloodbank.entity.Donor;

public interface DonorRepository extends JpaRepository<Donor, Long> {

}