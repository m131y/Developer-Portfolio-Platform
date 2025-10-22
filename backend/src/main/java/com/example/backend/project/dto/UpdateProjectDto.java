package com.example.backend.project.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class UpdateProjectDto {
    @Size(max=140)
    private String title;

    @Size(max=300)
    private String summary;

    private String descriptionMd;
    private LocalDate startDate;
    private LocalDate endDate;
    private String type;
    private String status;
    private String repoUrl;
    private String demoUrl;
    private String docUrl;
    private String thumbnailUrl;
    private String visibility;
    private List<Long> techIds;
}
