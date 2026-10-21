package com.example.smartbloodbank.service;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.smartbloodbank.entity.BloodStock;
import com.example.smartbloodbank.entity.Report;
import com.example.smartbloodbank.repository.ReportRepository;
import com.example.smartbloodbank.repository.BloodStockRepository;

@Service
public class ReportService {

    @Autowired
    private ReportRepository repository;

    @Autowired
    private BloodStockRepository bloodStockRepository;

    public Report addReport(Report report) {
        return repository.save(report);
    }

    public List<Report> getAllReports() {
        return repository.findAll();
    }

    public Report getReportById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Report updateReport(Long id, Report report) {

        Report existingReport = repository.findById(id).orElse(null);

        if (existingReport != null) {

            existingReport.setReportType(report.getReportType());
            existingReport.setReportDate(report.getReportDate());
            existingReport.setDetails(report.getDetails());

            return repository.save(existingReport);
        }

        return null;
    }

    public void deleteReport(Long id) {
        repository.deleteById(id);
    }
    public List<Report> generateLowStockReports() {

        List<BloodStock> lowStockList = bloodStockRepository.findAll()
                .stream()
                .filter(stock -> stock.getAvailableUnits() < 10)
                .toList();

        for (BloodStock stock : lowStockList) {

            String bloodGroup = stock.getBloodGroup();

            boolean alreadyExists =
                    repository.existsByReportTypeAndDetailsContaining(
                            "Low Stock Alert",
                            bloodGroup
                    );

            if (!alreadyExists) {

                Report report = new Report();

                report.setReportType("Low Stock Alert");
                report.setReportDate(java.time.LocalDate.now().toString());

                report.setDetails(
                        bloodGroup
                        + " blood stock is below the minimum level. "
                        + "Available units: "
                        + stock.getAvailableUnits()
                );

                repository.save(report);
            }
        }

        return repository.findAll();
    }
    
}