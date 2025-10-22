package com.example.backend.user.dto;

import com.example.backend.user.entity.User;
import lombok.Getter;

@Getter
public class ProfileResponseDto {

    private String email;
    private String nickname;
    private String job;
    private String profileImageUrl;

    public ProfileResponseDto(User user) {
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.job = user.getJob();
        this.profileImageUrl = user.getProfileImageUrl();
    }
}
