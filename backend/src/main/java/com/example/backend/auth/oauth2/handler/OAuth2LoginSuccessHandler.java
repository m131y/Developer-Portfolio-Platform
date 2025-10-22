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

        // 1. authentication 객체에서 OAuth2User를 가져온다.
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // 2. CustomOAuth2UserService에서 "userEmail" 키로 저장했던 이메일을 꺼낸다.
        String email = (String) oAuth2User.getAttribute("userEmail");

        // 3. 이메일로 DB에서 사용자를 조회한다.
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("이메일에 해당하는 유저가 없습니다."));

        // 4. 해당 사용자로 JWT 토큰을 생성한다.
        // (JwtTokenProvider의 토큰 생성 메서드명은 실제 코드에 맞게 수정)
        String token = jwtTokenProvider.createToken(user);
        log.info("JWT 토큰이 발급되었습니다. 토큰: {}", token);

        // 5. 프론트엔드(React)로 리다이렉트할 URL을 생성한다.
        //    토큰을 쿼리 파라미터로 함께 보낸다.
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth-redirect") // ◀◀◀ 프론트엔드 주소
                .queryParam("token", token)
                .build()
                .encode(StandardCharsets.UTF_8)
                .toUriString();

        // 6. 생성된 URL로 리다이렉트시킨다.
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}