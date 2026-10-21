package com.example.smartbloodbank.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.smartbloodbank.entity.BloodStock;
import com.example.smartbloodbank.repository.BloodStockRepository;

@Service
public class BloodStockService {

    @Autowired
    private BloodStockRepository repository;

    // Add blood stock
    public BloodStock addStock(BloodStock stock) {
        return repository.save(stock);
    }

    // Get all blood stock
    public List<BloodStock> getAllStock() {
        return repository.findAll();
    }

    // Get stock by ID
    public BloodStock getStockById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update blood stock
    public BloodStock updateStock(Long id, BloodStock stock) {

        BloodStock existingStock = repository.findById(id).orElse(null);

        if (existingStock != null) {

            existingStock.setBloodGroup(stock.getBloodGroup());
            existingStock.setAvailableUnits(stock.getAvailableUnits());
            existingStock.setLastUpdated(stock.getLastUpdated());

            return repository.save(existingStock);
        }

        return null;
    }

    // Delete blood stock
    public void deleteStock(Long id) {
        repository.deleteById(id);
    }

    // Get low stock
    public List<BloodStock> getLowStock() {

        List<BloodStock> allStock = repository.findAll();

        return allStock.stream()
                .filter(stock -> stock.getAvailableUnits() < 10)
                .toList();
    }
}