package com.example.backend.auth.oauth2.dto;

import com.example.backend.user.entity.User; // ◀◀◀ import 경로 확인
import lombok.Builder;
import lombok.Getter;

import java.util.Map;
import java.util.UUID;

@Getter
public class OAuthAttributes {
    private Map<String, Object> attributes;
    private String nameAttributeKey;
    private String name;
    private String email;
    private String provider; // "google" 또는 "github"

    @Builder
    public OAuthAttributes(Map<String, Object> attributes, String nameAttributeKey,
                           String name, String email, String provider) {
        this.attributes = attributes;
        this.nameAttributeKey = nameAttributeKey;
        this.name = name;
        this.email = email;
        this.provider = provider;
    }

    /**
     * provider 이름과 사용자 속성을 받아서 OAuthAttributes DTO로 변환
     */
    public static OAuthAttributes of(String provider, String userNameAttributeName, Map<String, Object> attributes) {
        if ("github".equalsIgnoreCase(provider)) {
            return ofGithub(userNameAttributeName, attributes);
        }
        return ofGoogle(userNameAttributeName, attributes);
    }

    /**
     * Google 사용자 정보 파싱
     */
    private static OAuthAttributes ofGoogle(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .provider("google")
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    /**
     * GitHub 사용자 정보 파싱
     */
    private static OAuthAttributes ofGithub(String userNameAttributeName, Map<String, Object> attributes) {
        String email = (String) attributes.get("email");
        String nickname = (String) attributes.get("login"); // GitHub는 'login'을 닉네임으로 사용

        if (email == null) {
            // GitHub 이메일 비공개 시, 임시 이메일 생성 (혹은 에러 처리)
            email = nickname + "@github.temp"; // ◀◀◀ 임시 이메일
        }

        return OAuthAttributes.builder()
                .name(nickname) // ◀◀◀ GitHub는 name 대신 login을 사용
                .email(email)
                .provider("github")
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    /**
     * 이 DTO의 정보를 바탕으로 새 User 엔티티를 생성 (회원가입 시 사용)
     */
    public User toEntity() {
        return User.builder()
                .email(email)
                .nickname(name) // ◀◀◀ 소셜 유저의 이름(name)을 닉네임(nickname)으로 사용
                .password(null) // ◀◀◀ 소셜 유저는 비밀번호가 없으므로 null
                .provider(provider) // ◀◀◀ provider 필드 설정
                .role("ROLE_USER") // ◀◀◀ 기본 역할
                .build();
    }
}