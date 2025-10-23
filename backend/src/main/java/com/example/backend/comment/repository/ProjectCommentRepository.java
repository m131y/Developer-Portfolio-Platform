package com.example.backend.comment.repository;

import com.example.backend.comment.entity.ProjectComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectCommentRepository extends JpaRepository<ProjectComment, Long> {
    List<ProjectComment> findByProjectIdOrderByCreatedAtAsc(Long projectId);
    List<ProjectComment> findByParentIdOrderByCreatedAtAsc(Long parentId);
}
