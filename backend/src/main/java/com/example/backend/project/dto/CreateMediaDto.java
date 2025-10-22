package com.example.backend.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMediaDto {
    @NotBlank
    private String type;

    @NotBlank
    private String url;

    private Integer sortOrder;

    @NotNull
    private Long sizeBytes;

}
