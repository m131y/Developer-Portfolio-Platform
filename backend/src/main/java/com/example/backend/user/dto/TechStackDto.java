package com.example.backend.user.dto;

import com.example.backend.user.entity.TechStack;
import lombok.Getter;

@Getter
public class TechStackDto {

    private Long id;
    private String techName;

    public TechStackDto(TechStack techStack) {
        this.id = techStack.getId();
        this.techName = techStack.getTechName();
    }
}