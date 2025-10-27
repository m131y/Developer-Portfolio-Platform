package com.example.backend.analysis.controller;

import com.example.backend.analysis.dto.ProjectPreviewDto;
import com.example.backend.project.dto.ProjectDetailDto;
import com.example.backend.analysis.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AnalysisController {
    private final AnalysisService analysisService;

    @GetMapping("/api/analysis/posts")
    public ResponseEntity<List<ProjectPreviewDto>> getPopularPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(analysisService.getPopularPosts(pageable));
    }

//    @GetMapping("/api/analysis/post/{postId}/likes")
//    public ResponseEntity<List<LikeTrendDto>> getLikeTrend(
//            @PathVariable Long postId,
//            @RequestParam(required = false) Optional<LocalDateTime> startDate
//    ) {
//        return ResponseEntity.ok(analysisService.getLikeTrend(postId, startDate));
//    }
}