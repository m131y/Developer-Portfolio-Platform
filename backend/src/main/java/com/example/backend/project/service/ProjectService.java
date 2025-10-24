package com.example.backend.project.service;

import com.example.backend.project.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectService {
    ProjectDetailDto createProject(CreateProjectDto dto, Long userId);
    ProjectDetailDto updateProject(Long id, UpdateProjectDto dto, Long userId);
    ProjectDetailDto getProjectDetail(Long id,Long userId);
    List<ProjectListItemDto> getProjectsByOwner(Long userId);
    void deleteProject(Long id, Long userId);
    ProjectMediaDto addMedia(Long projectId, CreateMediaDto dto, Long userId);
    void removeMedia(Long projectId, Long mediaId, Long userId);

    List<ProjectListItemDto> searchProjects(String keyword);
    Page<ProjectListItemDto> getAllProjects(Pageable pageable);
}
