package com.disaster.management.controller;

import com.disaster.management.entity.Alert;
import com.disaster.management.repository.AlertRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/alerts")
public class AlertController {

    private final AlertRepository alertRepository;

    public AlertController(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }
    @PostMapping
    public ResponseEntity<Alert> createAlert(@Valid @RequestBody Alert alert) {

        alert.setCreatedAt(LocalDateTime.now());

        Alert saved = alertRepository.save(alert);

        return ResponseEntity.ok(saved);
    }
    @GetMapping
    public ResponseEntity<List<Alert>> getAllAlerts() {

        List<Alert> alerts = alertRepository.findAll();

        return ResponseEntity.ok(alerts);
    }

}