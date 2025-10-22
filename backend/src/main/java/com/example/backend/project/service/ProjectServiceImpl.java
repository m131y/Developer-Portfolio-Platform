package com.example.backend.project.service;

import com.example.backend.project.dto.CreateProjectDto;
import com.example.backend.project.dto.ProjectDetailDto;
import com.example.backend.project.entity.Project;
import com.example.backend.project.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService{

    private final ProjectRepository projectRepository;

    @Override
    public ProjectDetailDto createProject(CreateProjectDto dto, Long userId){
        Project project = Project.builder()
                .title(dto.getTitle())
                .summary(dto.getSummary())
                .descriptionMd(dto.getDescriptionMd())
                .type(dto.getType())
                .status(dto.getStatus())
                .repoUrl(dto.getRepoUrl())
                .demoUrl(dto.getDemoUrl())
                .docUrl(dto.getDocUrl())
                .thumbnailUrl(null)
                .ownerId(userId)
                .build();

        Project saved = projectRepository.save(project);
        return new ProjectDetailDto(saved.getId(), saved.getTitle(), saved.getSummary(),
                saved.getDescriptionMd(), saved.getOwnerId(), null,
                saved.getType(), saved.getStatus(),
                null, null, 0L, 0L, false, null, null);

    }
}
