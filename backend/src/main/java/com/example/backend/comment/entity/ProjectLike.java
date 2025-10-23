package com.example.backend.comment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

// Each combination of user and project should be unique
@Entity @Table(name = "project_likes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "projectId"}))
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProjectLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long projectId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

}
