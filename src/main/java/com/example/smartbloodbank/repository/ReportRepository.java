package com.example.smartbloodbank.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.smartbloodbank.entity.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {

    boolean existsByReportTypeAndDetailsContaining(
            String reportType, String bloodGroup);

}