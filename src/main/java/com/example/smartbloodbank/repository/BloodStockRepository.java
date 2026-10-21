package com.example.smartbloodbank.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smartbloodbank.entity.BloodStock;

public interface BloodStockRepository extends JpaRepository<BloodStock, Long> {

}