package com.example.backend.auth.oauth2.service;

import com.example.backend.auth.oauth2.dto.OAuthAttributes;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository; // ◀◀◀ UserRepository import
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User; // ◀◀◀ import
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ◀◀◀ import

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // ◀◀◀ 기본적으로 읽기 전용 트랜잭션
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    // ▼▼▼▼▼ UserRepository 주입 ▼▼▼▼▼
    private final UserRepository userRepository;
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    @Override
    @Transactional // ◀◀◀ DB에 저장해야 하므로 쓰기 트랜잭션
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        // 1. 부모 클래스(DefaultOAuth2UserService)가 소셜 로그인 정보를 받아온다.
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 2. 어떤 소셜 로그인인지 provider(google, github 등) 정보 가져오기
        String provider = userRequest.getClientRegistration().getRegistrationId();

        // 3. provider로부터 받아온 유저 식별 키(PK) 이름 가져오기
        // (Google은 "sub", GitHub는 "id" 등)
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        // 4. 받아온 정보를 우리가 만든 DTO (OAuthAttributes)로 변환
        OAuthAttributes attributes = OAuthAttributes.of(provider, userNameAttributeName, oAuth2User.getAttributes());

        // 5. 이 DTO 정보를 기반으로 DB에서 사용자를 찾거나, 없으면 새로 저장 (핵심!)
        User user = saveOrUpdate(attributes);

        // 6. Spring Security가 관리할 인증 객체로 변환하여 반환
        //    (기존 속성 + "표준 이메일"을 추가한 새 Map 생성)
        Map<String, Object> newAttributes = new HashMap<>(attributes.getAttributes());
        // [핵심] 핸들러가 사용자 이메일을 쉽게 찾을 수 있도록 "userEmail" 키로 저장
        newAttributes.put("userEmail", user.getEmail());

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(user.getRole())),
                newAttributes,
                attributes.getNameAttributeKey()
        );
    }

    /**
     * DB에 사용자가 있는지 확인하고, 없으면 새로 저장
     * (수정됨: email을 유일한 식별자로 사용)
     */
    private User saveOrUpdate(OAuthAttributes attributes) {
        // 1. 이메일로 사용자를 찾는다.
        Optional<User> userOptional = userRepository.findByEmail(attributes.getEmail());

        User user;
        if (userOptional.isPresent()) {
            // [업데이트] 이미 가입된 유저라면
            user = userOptional.get();

            // (선택 사항) 만약 provider가 다르다면, 기존 유저 정보에 provider 정보를 업데이트 할 수 있음
            // 예: "local" 유저가 "google"로 첫 로그인 시, provider를 "local,google"로 업데이트
            // 여기서는 일단 기존 유저를 그대로 반환합니다.
            log.info("기존 유저가 소셜 로그인을 시도합니다. User Email: {}", user.getEmail());

            // TODO: (선택 사항) 닉네임이나 프로필 이미지가 변경되었으면 업데이트
            // user.updateProfile(attributes.getName(), ...);

        } else {
            // [저장] 처음 가입하는 유저라면
            user = attributes.toEntity(); // DTO를 User 엔티티로 변환
            userRepository.save(user);

            log.info("신규 유저입니다. User Email: {}, Provider: {}", user.getEmail(), user.getProvider());
        }

        return user;
    }
}