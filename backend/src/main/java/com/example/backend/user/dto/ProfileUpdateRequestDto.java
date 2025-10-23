package com.example.backend.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProfileUpdateRequestDto {

    private String nickname;
    private String job;
    private String experience;
    private String bio;
    private String location;
    private String profileImageUrl;
}