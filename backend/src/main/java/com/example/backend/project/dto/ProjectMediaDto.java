package com.example.backend.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ProjectMediaDto {
    private Long id;
    private String type;
    private String url;
    private Integer sortOrder;
    private Long sizeBytes;
}
