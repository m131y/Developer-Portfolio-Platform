package com.example.backend.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ProjectListItemDto {
    private Long id;
    private String title;
    private String summary;
    private String thumbnailUrl;
    private String status;
    private String visibility;
    private Long ownerId;
    private String ownerNickname;
    private Long likeCount;
    private Long viewCount;
    private Instant createdAt;
}
