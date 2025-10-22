package com.example.backend.project.service;

import com.example.backend.project.dto.CreateProjectDto;
import com.example.backend.project.dto.ProjectDetailDto;
import com.example.backend.project.dto.UpdateProjectDto;
import com.example.backend.project.entity.Project;
import com.example.backend.project.mapper.ProjectMapper;
import com.example.backend.project.repository.ProjectMediaRepository;
import com.example.backend.project.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService{

    private final ProjectRepository projectRepository;
    private final ProjectMediaRepository projectMediaRepository;
    private final ProjectMapper mapper;

    @Override
    public ProjectDetailDto createProject(CreateProjectDto dto, Long userId) {
        Project entity = mapper.toEntity(dto);
        entity.setOwnerId(userId);
        Project saved = projectRepository.save(entity);

        ProjectDetailDto out = mapper.toDetail(saved);
        out.setMedia(List.of()); // 초기에는 미디어 없음
        return out;
    }

    @Override
    public ProjectDetailDto updateProject(Long id, UpdateProjectDto dto, Long userId){
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return null;
    }
}
