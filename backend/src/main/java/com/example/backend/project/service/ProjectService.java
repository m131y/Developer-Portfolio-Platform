package com.example.backend.project.service;

import com.example.backend.project.dto.CreateProjectDto;
import com.example.backend.project.dto.ProjectDetailDto;
import com.example.backend.project.dto.UpdateProjectDto;

public class ProjectService {
    ProjectDetailDto create(Long userId, CreateProjectDto req);
    ProjectDetailDto update(Long userId, Long projectId, UpdateProjectDto req);
    void softDelete(Long userId, Long projectId);
    ProjectDetailDto getOne(Long viewerId, Long projectId);
}
