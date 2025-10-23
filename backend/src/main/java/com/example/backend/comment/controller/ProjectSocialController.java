package com.example.backend.comment.controller;

import com.example.backend.comment.dto.CommentDto;
import com.example.backend.comment.dto.CreateCommentDto;
import com.example.backend.comment.dto.LikeResponseDto;
import com.example.backend.comment.service.ProjectSocialService;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects/{projectId}")
public class ProjectSocialController {

    private final ProjectSocialService socialService;
    private final UserRepository userRepository;

    private Long getCurrentUserId(String email) {
        if (email == null) {
            throw new IllegalStateException("Unauthenticated user");
        }
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new IllegalStateException("User not found for email " + email));
    }

    //Toggle like for a project
    @PostMapping("/likes")
    public ResponseEntity<LikeResponseDto> toggleLike(
            @PathVariable Long projectId,
            @AuthenticationPrincipal String userEmail){
        Long userId = getCurrentUserId(userEmail);
        return ResponseEntity.ok(socialService.toggleLike(projectId, userId));
    }

    //current like count and whether the user has liked the projects
    @GetMapping("/likes")
    public ResponseEntity<LikeResponseDto> getLikeStatus(
            @PathVariable Long projectId,
            @AuthenticationPrincipal String userEmail){
        Long userId = getCurrentUserId(userEmail);
        return ResponseEntity.ok(socialService.getLikeStatus(projectId, userId));
    }

    // Create a new comment
    @PostMapping("/comments")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable Long projectId,
            @AuthenticationPrincipal String userEmail,
            @Valid @RequestBody CreateCommentDto dto) {
        Long userId = getCurrentUserId(userEmail);
        return ResponseEntity.ok(socialService.addComment(projectId, userId, dto));
    }

    @GetMapping("/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long projectId){
        return ResponseEntity.ok(socialService.getComments(projectId));
    }

}
