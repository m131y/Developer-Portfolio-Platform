package com.example.backend.analysis.service;

import com.example.backend.analysis.dto.ProjectPreviewDto;
import com.example.backend.comment.repository.ProjectLikeRepository;
import com.example.backend.project.dto.ProjectDetailDto;
import com.example.backend.project.entity.Project;
import com.example.backend.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalysisService {
    private final ProjectRepository projectRepository;
    private final ProjectLikeRepository likeRepository;

    // 인기프로젝트 조회
    public List<ProjectPreviewDto> getPopularPosts(Pageable pageable) {
        List<Project> top4Posts = projectRepository.findTopProjectsOrderByLikeCount(pageable);
        return top4Posts.stream().map(post -> ProjectPreviewDto.fromEntity(post)).collect(Collectors.toList());
    }

//    // 프로젝트 좋아요 추이
//    public List<LikeTrendDto> getLikeTrend(Long postId, Optional<LocalDateTime> startDate) {
//
//        LocalDateTime finalStartDate = startDate.orElseGet(() ->
//                LocalDateTime.now().minusDays(30)
//        );
//
//        List<LikeTrendDto> likeTrend = likeRepository.findDailyLikeTrendByPostId(postId, finalStartDate);
//        return likeTrend;
//    }
}
