package com.example.backend.user.dto;

import com.example.backend.user.entity.LinkType;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SocialLinkRequestDto {

    private LinkType linkType; // GITHUB, BLOG 등
    private String url;
}