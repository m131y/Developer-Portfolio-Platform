package com.example.backend.user.dto;

import com.example.backend.user.entity.UserTechStack;
import lombok.Getter;

@Getter
public class UserTechStackDto {

    private Long id;
    private TechStackDto techStack;

    public UserTechStackDto(UserTechStack userTechStack) {
        this.id = userTechStack.getId();
        this.techStack = new TechStackDto(userTechStack.getTechStack());
    }
}