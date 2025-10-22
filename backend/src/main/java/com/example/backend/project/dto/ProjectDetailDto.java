package com.example.backend.project.dto;

import lombok.*;

import java.time.Instant;

@Data @Builder
@AllArgsConstructor @NoArgsConstructor
public class ProjectDetailDto {
    private Long id;
    private String title;
    private String summary;
    private String descriptionMd;
    private Long ownerId;
    private String ownerNickname;
    private String thumbnailUrl;
    private String type;
    private String status;
    private String visibility;
    private java.util.List<TechTagDto> techStacks;
    private java.util.List<ProjectMediaDto> media;
    private Long likeCount;
    private Long viewCount;
    private Boolean likedByMe;
    private Instant createdAt;
    private Instant updatedAt;
}
