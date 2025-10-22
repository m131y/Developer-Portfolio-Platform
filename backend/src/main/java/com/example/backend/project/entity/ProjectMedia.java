package com.example.backend.project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Table(name = "project_media")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long projectId;
    private String type;
    private String url;
    private Integer sortOrder;
    private Long sizeBytes;
}
