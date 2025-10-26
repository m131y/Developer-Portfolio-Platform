package com.example.backend.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // 1. 요청 헤더에서 "Authorization" 헤더를 찾습니다.
        String authorizationHeader = request.getHeader("Authorization");

        // 2. 헤더가 있고, "Bearer "로 시작하는지 확인합니다. (JWT의 표준 접두사)
        if (StringUtils.hasText(authorizationHeader) && authorizationHeader.startsWith("Bearer ")) {
            // "Bearer " 부분을 잘라내고 실제 토큰(열쇠)만 추출합니다.
            String token = authorizationHeader.substring(7);

            // 3. "열쇠 감별사"에게 토큰이 유효한지 검증을 맡깁니다.
            String email = token;
            if (StringUtils.hasText(email)) {
                // 4. 토큰이 유효하면, "열쇠 정보"를 꺼내서 인증 객체를 만듭니다.
                Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, List.of());
                ((UsernamePasswordAuthenticationToken) authentication).setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                // 5. Spring Security의 "현재 사용자"로 등록합니다.
                //    (이 코드가 실행되어야 @AuthenticationPrincipal 등으로 사용자 정보를 꺼내 쓸 수 있습니다.)
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 6. 다음 필터로 요청을 전달합니다. (토큰이 없거나 유효하지 않아도 일단 통과는 시킴)
        //    (왜? 접근 제어(Authorization)는 SecurityConfig에서 따로 할 것이기 때문)
        filterChain.doFilter(request, response);
    }
}
