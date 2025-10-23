package com.example.backend.project.service;

import com.example.backend.project.dto.*;
import com.example.backend.project.entity.Project;
import com.example.backend.project.entity.ProjectMedia;
import com.example.backend.project.mapper.ProjectMapper;
import com.example.backend.project.repository.ProjectMediaRepository;
import com.example.backend.project.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService{

    private final ProjectRepository projectRepository;
    private final ProjectMediaRepository mediaRepository;
    private final ProjectMapper mapper;

    @Override
    public ProjectDetailDto createProject(CreateProjectDto dto, Long userId) {
        Project entity = mapper.toEntity(dto);
        entity.setOwnerId(userId);
        Project saved = projectRepository.save(entity);

        ProjectDetailDto out = mapper.toDetail(saved);
        out.setMedia(List.of());
        return out;
    }

    @Override
    public ProjectDetailDto updateProject(Long projectId, UpdateProjectDto dto, Long userId){
        Project entity = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if(!entity.getOwnerId().equals(userId)) {
            throw new EntityNotFoundException("Project not found");
        }
        mapper.merge(dto, entity);

        Project saved = projectRepository.save(entity);

        ProjectDetailDto out = mapper.toDetail(saved);
        var mediaList = mediaRepository.findByProjectId(saved.getId());
        out.setMedia(mapper.toMediaList(mediaList));
        return out;
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDetailDto getProjectDetail(Long projectId, Long viewerId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        //visibility (추가 or X)
        if ("PRIVATE".equalsIgnoreCase(project.getVisibility())) {
            if (viewerId == null || !project.getOwnerId().equals(viewerId)){
                throw new EntityNotFoundException("Not Authorized");
            }
        }

        ProjectDetailDto out = mapper.toDetail(project);
        var mediaList = mediaRepository.findByProjectId(projectId);
        out.setMedia(mapper.toMediaList(mediaList));
        return out;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectListItemDto> getProjectsByOwner(Long userId) {
        return projectRepository.findByOwnerId(userId)
                .stream()
                .map(mapper::toListItem)
                .toList();
    }

    @Override
    public void deleteProject(Long projectId , Long userId){
        Project project = projectRepository.findById(projectId)
                .orElseThrow(()-> new EntityNotFoundException("Project not found"));
        if(!project.getOwnerId().equals(userId)) {
            throw new EntityNotFoundException("Not authorized");
        }
        projectRepository.delete(project);
    }

    @Override
    public ProjectMediaDto addMedia(Long projectId, CreateMediaDto dto, Long userId){
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        if(!project.getOwnerId().equals(userId)) {
            throw new EntityNotFoundException("Not authorized");
        }
        ProjectMedia media = ProjectMedia.builder()
                .projectId(projectId)
                .type(dto.getType())
                .url(dto.getUrl())
                .sortOrder(dto.getSortOrder())
                .sizeBytes(null) // 필요시
                .build();
        return mapper.toMedia(mediaRepository.save(media));
    }

    @Override
    public void removeMedia (Long projectId, Long mediaId, Long userId){
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        if (!project.getOwnerId().equals(userId)) {
            throw new EntityNotFoundException("Not authorized");
        }
        mediaRepository.deleteById(mediaId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectListItemDto> searchProjects(String keyword) {
        if (keyword == null || keyword.isBlank()){
            return List.of();
        }
        String sanitized = keyword.trim();
        return projectRepository
                .findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(sanitized, sanitized)
                .stream()
                .map(mapper::toListItem)
                .toList();
    }
}
