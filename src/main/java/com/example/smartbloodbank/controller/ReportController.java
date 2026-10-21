package com.example.smartbloodbank.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.smartbloodbank.entity.Report;
import com.example.smartbloodbank.service.ReportService;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService service;

    @PostMapping
    public Report addReport(@RequestBody Report report) {
        return service.addReport(report);
    }

    @GetMapping
    public List<Report> getAllReports() {
        return service.getAllReports();
    }
 // Generate low stock reports
    @GetMapping("/generate-low-stock")
    public List<Report> generateLowStockReports() {
        return service.generateLowStockReports();
    }

    @GetMapping("/{id}")
    public Report getReportById(@PathVariable Long id) {
        return service.getReportById(id);
    }

    @PutMapping("/{id}")
    public Report updateReport(
            @PathVariable Long id,
            @RequestBody Report report) {

        return service.updateReport(id, report);
    }

    @DeleteMapping("/{id}")
    public String deleteReport(@PathVariable Long id) {

        service.deleteReport(id);

        return "Report deleted successfully";
    }
}