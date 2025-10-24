package com.example.backend.auth.oauth2.handler;

import com.example.backend.global.security.JwtTokenProvider;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {

        log.info("OAuth 2.0 로그인 성공!");

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        final String email = oAuth2User.getAttribute("userEmail") != null
                ? (String) oAuth2User.getAttribute("userEmail")
                : (String) oAuth2User.getAttribute("email");

        log.info("OAuth 2.0 로그인 - 이메일: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    log.info("신규 OAuth2 사용자 생성: {}", email);
                    String name = (String) oAuth2User.getAttribute("name");
                    String provider = oAuth2User.getAttribute("sub") != null ? "google" : "github";

                    User newUser = User.builder()
                            .email(email)
                            .nickname(name != null ? name : email.split("@")[0])
                            .password(null)
                            .provider(provider)
                            .role("ROLE_USER")
                            .build();
                    return userRepository.saveAndFlush(newUser);
                });

        String token = jwtTokenProvider.createToken(user);
        log.info("JWT 토큰 발급 완료");

        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth-redirect")
                .queryParam("token", token)
                .build()
                .encode(StandardCharsets.UTF_8)
                .toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}