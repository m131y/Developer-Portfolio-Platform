package com.example.backend.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CreateProjectDto {
    @NotBlank
    @Size(max=140)
    private String title;

    @Size(max=300)
    private String summary;
    private String descriptionMd;
    private LocalDate startDate;
    private LocalDate endDate;

    @Size(max=20)
    private String type;

    @Size(max=20)
    private String status;
    private String repoUrl;
    private String demoUrl;
    private String docUrl;

    @Size(max=10)
    private String visibility;

    private List<Long> techIds;
}
