package com.example.backend.project.repository;

import com.example.backend.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwnerId(Long ownerId);


    /**
     * Find projects where the title or summary contains the provided keyword,
     * case‑insensitive. Spring Data will derive the appropriate query based
     * on the method name.
     *
     * @param titleKeyword   substring to search for in the title
     * @param summaryKeyword substring to search for in the summary
     * @return list of matching projects
     */
    List<Project> findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(String titleKeyword, String summaryKeyword);
}
