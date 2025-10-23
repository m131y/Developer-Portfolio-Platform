package com.example.backend.comment.repository;

import com.example.backend.comment.entity.ProjectLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectLikeRepository extends JpaRepository<ProjectLike, Long> {
    boolean existsByProjectIdAndUserId(Long projectId, Long userId);
    long countByProjectId(Long projectId);
}
