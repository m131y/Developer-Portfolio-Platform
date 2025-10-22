package com.example.backend.project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project_tech_stack")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectTechStack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long projectId;
    private Long techId;
    private Short level;
}
