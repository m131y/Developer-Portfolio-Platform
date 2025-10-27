package com.example.backend.project.repository;

import com.example.backend.project.entity.Project;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    @Query("SELECT p " +
            "FROM Project p LEFT JOIN ProjectLike pl ON p.id = pl.projectId " +
            "GROUP BY p " +
            "ORDER BY COUNT(pl.id) DESC, p.id ASC") // 좋아요 수 내림차순, 동일하면 ID 오름차순으로 정렬
    List<Project> findTopProjectsOrderByLikeCount(Pageable pageable);
}
