package com.example.backend.analysis.dto;

import com.example.backend.project.dto.ProjectDetailDto;
import com.example.backend.project.entity.Project;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProjectPreviewDto {
    private Long id;
    private String title;
    private String summary;
//    private Long likeCount;

    public static ProjectPreviewDto fromEntity(Project project) {
        return ProjectPreviewDto.builder()
                .id(project.getId())
                .title(project.getTitle())
                .summary(project.getSummary())
//                .likeCount(project.get)
                .build();
    }
}
