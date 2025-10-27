package com.example.backend.comment.controller;

import com.example.backend.comment.dto.CommentDto;
import com.example.backend.comment.dto.CreateCommentDto;
import com.example.backend.comment.dto.LikeResponseDto;
import com.example.backend.comment.service.ProjectSocialService;
import com.example.backend.notification.dto.NotificationDto;
import com.example.backend.notification.service.NotificationService;
import com.example.backend.project.entity.Project;
import com.example.backend.project.repository.ProjectRepository;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects/{projectId}")
public class ProjectSocialController {

    private final ProjectRepository projectRepository;
    private final ProjectSocialService socialService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

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
            @RequestParam String userEmail,
            @Valid @RequestBody CreateCommentDto dto) {
        Long userId = getCurrentUserId(userEmail);
        User currentUser = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("댓글 작성자를 찾을 수 없습니다."));

        // 댓글 생성
        CommentDto commentDto = socialService.addComment(projectId, userId, dto);

        // 알림 게시글
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("해당 게시글을 찾을 수 없습니다."));

        // 알림을 받을 대상
        String targetUserId = String.valueOf(project.getOwnerId());
        User targetUser = userRepository.findById(Long.valueOf(targetUserId))
                .orElseThrow(() -> new RuntimeException("프로젝트 작성자를 찾을 수 없습니다."));

        NotificationDto notificationDto = NotificationDto.builder()
                .receiverId(targetUser.getId().toString())
                .content(currentUser.getNickname() + "님이 게시글에 댓글을 남겼습니다.")
                .createdAt(LocalDateTime.now().toString())
                .relatedUrl("/post/" + projectId)
                .type("COMMENT")
                .build();

        notificationService.sendNotification(targetUserId, notificationDto);

        return ResponseEntity.ok(commentDto);
    }

    @GetMapping("/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long projectId){
        return ResponseEntity.ok(socialService.getComments(projectId));
    }

}
