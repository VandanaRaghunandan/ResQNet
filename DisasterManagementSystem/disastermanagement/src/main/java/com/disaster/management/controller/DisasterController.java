
        package com.disaster.management.controller;

import com.disaster.management.entity.Disaster;
import com.disaster.management.repository.DisasterRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import com.disaster.management.service.GeoCodingService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
@RestController
@RequestMapping("/disasters")
public class DisasterController {
    @Autowired
    private SimpMessagingTemplate
            messagingTemplate;
    @Autowired
    private DisasterRepository disasterRepository;
    @Autowired
    private GeoCodingService geoCodingService;
    public DisasterController(
            DisasterRepository disasterRepository
    ) {
        this.disasterRepository =
                disasterRepository;
    }

    /* REPORT DISASTER */

    @PostMapping
    public ResponseEntity<Disaster>
    reportDisaster(
            @Valid
            @RequestBody Disaster disaster
    ) {


        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        disaster.setStatus("REPORTED");
        disaster.setReportedBy(email);
        double[] coordinates =
                geoCodingService
                        .getCoordinates(
                                disaster.getLocation()
                        );
        System.out.println(
                disaster.getLocation()
        );

        System.out.println(
                coordinates[0]
        );

        System.out.println(
                coordinates[1]
        );

        disaster.setLatitude(
                coordinates[0]
        );

        disaster.setLongitude(
                coordinates[1]
        );
        Disaster saved =
                disasterRepository.save(disaster);
        messagingTemplate.convertAndSend(
                "/topic/disasters",
                saved
        );
        return ResponseEntity.ok(saved);
    }

    /* GET ALL DISASTERS */

    @GetMapping
    public ResponseEntity<List<Disaster>>
    getAllDisasters() {

        return ResponseEntity.ok(
                disasterRepository.findAll()
        );
    }

    /* ASSIGN RESPONDER */

    @PutMapping("/{id}/assign")
    public ResponseEntity<Disaster>
    assignResponder(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {

        Disaster disaster =
                disasterRepository
                        .findById(id)
                        .orElse(null);

        if (disaster == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        String responderEmail =
                request.get(
                        "assignedResponder"
                );

        disaster.setAssignedTo(
                responderEmail
        );

        disaster.setStatus(
                "ASSIGNED"
        );

        Disaster updated =
                disasterRepository.save(disaster);

        return ResponseEntity.ok(
                updated
        );
    }

    /* UPDATE STATUS */

    @PutMapping("/{id}/status")
    public ResponseEntity<Disaster>
    updateStatus(
            @PathVariable Long id,
            @RequestParam String newStatus
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        Disaster disaster =
                disasterRepository
                        .findById(id)
                        .orElse(null);

        if (disaster == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (
                !email.equals(
                        disaster.getAssignedTo()
                )
        ) {

            return ResponseEntity
                    .status(403)
                    .build();
        }

        disaster.setStatus(
                newStatus
        );

        if (
                "RESOLVED".equals(
                        newStatus
                )
        ) {

            disaster.setResolvedAt(
                    LocalDateTime.now()
            );

        }

        Disaster updated =
                disasterRepository.save(
                        disaster
                );

        return ResponseEntity.ok(
                updated
        );
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Disaster>
    resolveDisaster(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("notes") String notes
    ) throws IOException {

        Disaster disaster =
                disasterRepository
                        .findById(id)
                        .orElse(null);

        if (disaster == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        String uploadDir = "uploads/";

        Files.createDirectories(
                Paths.get(uploadDir)
        );

        String fileName =
                System.currentTimeMillis()
                        + "_"
                        + file.getOriginalFilename();

        Path filePath =
                Paths.get(
                        uploadDir,
                        fileName
                );

        Files.write(
                filePath,
                file.getBytes()
        );

        disaster.setProofImage(
                fileName
        );

        disaster.setResolutionNotes(
                notes
        );

        disaster.setStatus(
                "RESOLVED"
        );

        disaster.setResolvedAt(
                LocalDateTime.now()
        );

        Disaster updated =
                disasterRepository.save(
                        disaster
                );

        return ResponseEntity.ok(
                updated
        );
    }


    /* MY INCIDENTS */

    @GetMapping("/my")
    public ResponseEntity<List<Disaster>>
    getMyDisasters() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        List<Disaster> disasters =
                disasterRepository
                        .findByAssignedTo(
                                email
                        );

        return ResponseEntity.ok(
                disasters
        );
    }

    /* RESOLVED INCIDENTS */

    @GetMapping("/resolved")
    public ResponseEntity<List<Disaster>>
    getResolvedDisasters() {

        return ResponseEntity.ok(
                disasterRepository.findByStatus(
                        "RESOLVED"
                )
        );
    }

    /* STATS */

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>>
    getDisasterStats() {

        Map<String, Long> stats =
                new HashMap<>();

        stats.put(
                "total",
                disasterRepository.count()
        );

        stats.put(
                "reported",
                disasterRepository.countByStatus(
                        "REPORTED"
                )
        );

        stats.put(
                "assigned",
                disasterRepository.countByStatus(
                        "ASSIGNED"
                )
        );

        stats.put(
                "inProgress",
                disasterRepository.countByStatus(
                        "IN_PROGRESS"
                )
        );

        stats.put(
                "resolved",
                disasterRepository.countByStatus(
                        "RESOLVED"
                )
        );

        return ResponseEntity.ok(
                stats
        );
    }
}

