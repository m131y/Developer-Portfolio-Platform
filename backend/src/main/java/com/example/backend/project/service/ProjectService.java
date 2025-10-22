package com.example.backend.project.service;

import com.example.backend.project.dto.CreateProjectDto;
import com.example.backend.project.dto.ProjectDetailDto;
import com.example.backend.project.dto.ProjectListItemDto;
import com.example.backend.project.dto.UpdateProjectDto;

import java.util.List;

public interface ProjectService {
    ProjectDetailDto createProject(CreateProjectDto dto, Long userId);
    ProjectDetailDto updateProject(Long id, UpdateProjectDto dto, Long userId);
    ProjectDetailDto getProjectDetail(Long id);
    List<ProjectListItemDto> getProjectsByOwner(Long userId);
    void deleteProject(Long id, Long userId);
}
