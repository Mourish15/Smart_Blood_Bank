package com.example.smartbloodbank.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.smartbloodbank.entity.BloodStock;
import com.example.smartbloodbank.service.BloodStockService;

@RestController
@RequestMapping("/bloodstock")
public class BloodStockController {

    @Autowired
    private BloodStockService service;

    // Add blood stock
    @PostMapping
    public BloodStock addStock(@RequestBody BloodStock stock) {
        return service.addStock(stock);
    }

    // Get all blood stock
    @GetMapping
    public List<BloodStock> getAllStock() {
        return service.getAllStock();
    }

    // Get low stock
    @GetMapping("/lowstock")
    public List<BloodStock> getLowStock() {
        return service.getLowStock();
    }

    // Get stock by ID
    @GetMapping("/{id}")
    public BloodStock getStockById(@PathVariable Long id) {
        return service.getStockById(id);
    }

    // Update blood stock
    @PutMapping("/{id}")
    public BloodStock updateStock(
            @PathVariable Long id,
            @RequestBody BloodStock stock) {

        return service.updateStock(id, stock);
    }

    // Delete blood stock
    @DeleteMapping("/{id}")
    public String deleteStock(@PathVariable Long id) {

        service.deleteStock(id);

        return "Blood stock deleted successfully";
    }
}