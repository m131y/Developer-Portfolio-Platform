package com.example.backend.project.service;

import com.example.backend.project.dto.*;
import com.example.backend.project.entity.Project;
import com.example.backend.project.entity.ProjectMedia;
import com.example.backend.project.entity.ProjectTechStack; // 🌟 추가
import com.example.backend.project.mapper.ProjectMapper;
import com.example.backend.project.repository.ProjectMediaRepository;
import com.example.backend.project.repository.ProjectRepository;
import com.example.backend.project.repository.ProjectTechStackRepository; // 🌟 추가
import com.example.backend.user.entity.User; // 🌟 추가 (닉네임 조회를 위해 User 엔티티 필요 가정)
import com.example.backend.user.repository.UserRepository; // 🌟 추가 (닉네임 조회를 위해)
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
// ... (기존 import 생략)

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService{

    private final ProjectRepository projectRepository;
    private final ProjectMediaRepository mediaRepository;
    private final ProjectTechStackRepository techStackRepository; // 🌟 주입
    private final ProjectMapper mapper;
    private final UserRepository userRepository; // 🌟 주입

    // ... (createProject, updateProject 메서드 생략. 기술스택 저장 로직도 추가해야 함)

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

        // visibility (추가 or X)
        if ("PRIVATE".equalsIgnoreCase(project.getVisibility())) {
            if (viewerId == null || !project.getOwnerId().equals(viewerId)){
                throw new EntityNotFoundException("Not Authorized");
            }
        }

        ProjectDetailDto out = mapper.toDetail(project);
        var mediaList = mediaRepository.findByProjectId(projectId);
        out.setMedia(mapper.toMediaList(mediaList));

// 🌟 Fix 1: ProjectTechStack 조회 및 설정 (아래 2번 내용)
        var techStackList = techStackRepository.findByProjectId(projectId);
        out.setTechStacks(mapper.toTechStackList(techStackList));

// 🌟 Fix 2: Owner Nickname 조회 및 설정 (수정/삭제 버튼 조건 확인에 필수)
// userEntity를 가정하고, userRepository를 주입했다고 가정합니다.
        userRepository.findById(project.getOwnerId()).ifPresent(owner -> {
            out.setOwnerNickname(owner.getNickname()); // User 엔티티에 getNickname()이 있다고 가정
        });

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

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectListItemDto> getAllProjects(Pageable pageable) {
        return projectRepository.findAll(pageable)
                .map(mapper::toListItem);
    }




}
