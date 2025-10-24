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
    private String provider;

    @Builder
    public OAuthAttributes(Map<String, Object> attributes, String nameAttributeKey,
                           String name, String email, String provider) {
        this.attributes = attributes;
        this.nameAttributeKey = nameAttributeKey;
        this.name = name;
        this.email = email;
        this.provider = provider;
    }

    public static OAuthAttributes of(String provider, String userNameAttributeName, Map<String, Object> attributes) {
        if ("github".equalsIgnoreCase(provider)) {
            return ofGithub(userNameAttributeName, attributes);
        }
        return ofGoogle(userNameAttributeName, attributes);
    }

    private static OAuthAttributes ofGoogle(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .provider("google")
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    private static OAuthAttributes ofGithub(String userNameAttributeName, Map<String, Object> attributes) {
        String email = (String) attributes.get("email");
        String nickname = (String) attributes.get("login");

        if (email == null) {
            email = nickname + "@github.temp";
        }

        return OAuthAttributes.builder()
                .name(nickname)
                .email(email)
                .provider("github")
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    public User toEntity() {
        return User.builder()
                .email(email)
                .nickname(name)
                .password(null)
                .provider(provider)
                .role("ROLE_USER")
                .build();
    }
}