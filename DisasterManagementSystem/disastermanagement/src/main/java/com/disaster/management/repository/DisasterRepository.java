
        package com.disaster.management.repository;

import com.disaster.management.entity.Disaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DisasterRepository
        extends JpaRepository<Disaster, Long> {

    List<Disaster> findByAssignedTo(
            String assignedTo
    );

    List<Disaster> findByStatus(
            String status
    );

    long countByStatus(
            String status
    );
}

