package com.example.backend.user.dto;

import com.example.backend.user.entity.User;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class ProfileResponseDto {

    private Long id;
    private String email;
    private String nickname;
    private String job;
    private String experience;
    private String bio;
    private String profileImageUrl;
    private String location;

    private List<SocialLinkDto> socialLinks;

    private List<UserTechStackDto> userTechStacks;

    public ProfileResponseDto(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.job = user.getJob();
        this.experience = user.getExperience();
        this.bio = user.getBio();
        this.profileImageUrl = user.getProfileImageUrl();
        this.location = user.getLocation();

        this.socialLinks = user.getSocialLinks().stream()
                .map(SocialLinkDto::new) // .map(socialLink -> new SocialLinkDto(socialLink))와 동일
                .collect(Collectors.toList());

        this.userTechStacks = user.getUserTechStacks().stream()
                .map(UserTechStackDto::new)
                .collect(Collectors.toList());
    }
}