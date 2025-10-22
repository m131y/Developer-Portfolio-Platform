package com.example.backend.project.controller;

import com.example.backend.project.dto.*;
import com.example.backend.project.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

/* # Auth 인증 (추후)

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(authService.register(request));
    }
*/

    //Temporary (no authentication)
    private Long currentUserId(String raw) {
        try {return raw == null ? 1L : Long.parseLong(raw); } catch (Exception e) {return 1L; }
    }

    @PostMapping
    public ResponseEntity<ProjectDetailDto> create(
            @RequestHeader(value = "X-User-Id", required = false) String uid,
            @Valid @RequestBody CreateProjectDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(dto, currentUserId(uid)));
    }

    @GetMapping ("/{id}")
    public ResponseEntity<ProjectDetailDto> detail(
            @RequestHeader(value = "X-User-Id", required = false) String uid,
            @PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectDetail(id, currentUserId(uid)));
    }

    @GetMapping ("/owner/{userId}")
    public ResponseEntity<List<ProjectListItemDto>> byOwner(@PathVariable Long userId) {
        return ResponseEntity.ok(projectService.getProjectsByOwner(userId));
    }

    @PutMapping ("/{id}")
    public ResponseEntity<ProjectDetailDto> update(
            @RequestHeader(value = "X-User-Id", required = false) String uid,
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectDto dto) {
        return ResponseEntity.ok(projectService.updateProject(id, dto, currentUserId(uid)));
    }

    @DeleteMapping ("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader(value = "X-User-Id", required = false) String uid,
            @PathVariable Long id){
        projectService.deleteProject(id, currentUserId(uid));
        return ResponseEntity.noContent().build();
    }

    // ---media---
    @PostMapping("/{projectId}/media")
    public ResponseEntity<ProjectMediaDto> addMedia(
            @RequestHeader(value = "X-User-Id", required = false) String uid,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateMediaDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.addMedia(projectId, dto, currentUserId(uid)));
    }

    @PostMapping("/{projectId}/media/{mediaId}")
    public ResponseEntity<Void> removeMedia(
            @RequestHeader(value = "X-User-Id", required = false) String uid,
            @PathVariable Long projectId,
            @PathVariable Long mediaId){
        projectService.removeMedia(projectId, mediaId, currentUserId(uid));
        return ResponseEntity.noContent().build();

    }

}
