package com.example.backend.user.dto;

import com.example.backend.user.entity.LinkType;
import com.example.backend.user.entity.SocialLink;
import lombok.Getter;

@Getter
public class SocialLinkDto {

    private Long id; // 소셜 링크 자체의 ID (나중에 수정/삭제 시 필요)
    private LinkType linkType; // GITHUB, BLOG 등
    private String url;

    // SocialLink 엔티티를 SocialLinkDto로 변환하는 생성자
    public SocialLinkDto(SocialLink socialLink) {
        this.id = socialLink.getId();
        this.linkType = socialLink.getLinkType();
        this.url = socialLink.getUrl();
    }
}