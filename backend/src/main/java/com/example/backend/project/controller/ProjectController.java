package com.example.backend.project.controller;

import com.example.backend.project.dto.*;
import com.example.backend.project.service.ProjectService;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    // (Added authentication with email)
    private Long getCurrentUserId(String email) {
        if (email == null) {
            throw new IllegalStateException("Unauthenticated user");
        }
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new IllegalStateException("User not found for email " + email));
    }

    @PostMapping
    public ResponseEntity<ProjectDetailDto> create(
            @AuthenticationPrincipal String userEmail,
            @Valid @RequestBody CreateProjectDto dto) {
        Long userId = getCurrentUserId(userEmail);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(dto, userId));
    }

    @GetMapping ("/{id}")
    public ResponseEntity<ProjectDetailDto> detail(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long id) {
        Long userId = getCurrentUserId(userEmail);

        return ResponseEntity.ok(projectService.getProjectDetail(id, userId));
    }

    @GetMapping ("/owner/{userId}")
    public ResponseEntity<List<ProjectListItemDto>> byOwner(@PathVariable Long userId) {

        return ResponseEntity.ok(projectService.getProjectsByOwner(userId));
    }

    @PutMapping ("/{id}")
    public ResponseEntity<ProjectDetailDto> update(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectDto dto) {
        Long userId = getCurrentUserId(userEmail);

        return ResponseEntity.ok(projectService.updateProject(id, dto, userId));
    }

    @DeleteMapping ("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long id){
        Long userId = getCurrentUserId(userEmail);
        projectService.deleteProject(id, userId);

        return ResponseEntity.noContent().build();
    }

    // ---media---
    @PostMapping("/{projectId}/media")
    public ResponseEntity<ProjectMediaDto> addMedia(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateMediaDto dto) {
        Long userId = getCurrentUserId(userEmail);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.addMedia(projectId, dto, userId));
    }

    @PostMapping("/{projectId}/media/{mediaId}")
    public ResponseEntity<Void> removeMedia(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long projectId,
            @PathVariable Long mediaId){
        Long userId = getCurrentUserId(userEmail);
        projectService.removeMedia(projectId, mediaId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProjectListItemDto>> searchProjects(
            @RequestParam String keyword) {
        return ResponseEntity.ok(projectService.searchProjects(keyword));
    }


}
