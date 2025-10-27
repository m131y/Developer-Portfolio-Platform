package com.example.backend.auth.oauth2.service;

import com.example.backend.auth.oauth2.dto.OAuthAttributes;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import com.example.backend.user.service.UserServiceTx; // ◀◀◀ UserServiceTx import
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
// @Transactional(readOnly = true) // ◀◀◀ 이전에 삭제 또는 주석 처리되어 있어야 합니다.
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final UserServiceTx userServiceTx; // ◀◀◀ UserServiceTx 주입

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        String provider = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        OAuthAttributes attributes = OAuthAttributes.of(provider, userNameAttributeName, oAuth2User.getAttributes());

        User user = saveOrUpdate(attributes);

        Map<String, Object> newAttributes = new HashMap<>(attributes.getAttributes());
        newAttributes.put("userEmail", user.getEmail());

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(user.getRole())),
                newAttributes,
                attributes.getNameAttributeKey()
        );
    }

    /**
     * DB에 사용자가 있는지 확인하고, 없으면 새로 저장 (UserTx를 통해 강제 커밋)
     */
    private User saveOrUpdate(OAuthAttributes attributes) {
        Optional<User> userOptional = userRepository.findByEmail(attributes.getEmail());

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            log.info("기존 유저가 소셜 로그인을 시도합니다. User Email: {}", user.getEmail());
        } else {
            // [저장] 처음 가입하는 유저라면
            User newUser = attributes.toEntity();

            // ▼▼▼ [핵심 수정] 분리된 서비스의 REQUIRES_NEW 메서드 호출 ▼▼▼
            user = userServiceTx.saveNewUser(newUser);

            log.info("신규 유저입니다. User Email: {}, Provider: {}", user.getEmail(), user.getProvider());
        }

        return user;
    }
}