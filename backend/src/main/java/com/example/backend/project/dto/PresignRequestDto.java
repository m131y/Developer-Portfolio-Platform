package com.example.backend.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PresignRequestDto {
    @NotBlank
    private String filename;

    @NotBlank
    private String contentType;

    @NotNull
    private Long sizeBytes;
}
