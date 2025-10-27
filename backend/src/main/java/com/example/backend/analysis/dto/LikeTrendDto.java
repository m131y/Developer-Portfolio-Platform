package com.example.backend.analysis.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LikeTrendDto {
    private LocalDateTime date;
    private Long likeCount;
}
