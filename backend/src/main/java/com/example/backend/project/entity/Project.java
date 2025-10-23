package com.example.backend.project.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 140)
    private String title;

    @Column(length = 300)
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String descriptionMd;
    private LocalDate startDate;
    private LocalDate endDate;

    @Column(length = 20)
    private String type;

    @Column(length = 20)
    private String status;

    private String repoUrl;
    private String demoUrl;
    private String docUrl;
    private String thumbnailUrl;

    @Column(length = 10)
    private String visibility;

    @Column(nullable = false)
    private Long ownerId;
}
