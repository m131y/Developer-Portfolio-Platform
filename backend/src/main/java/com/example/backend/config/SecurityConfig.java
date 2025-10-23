package com.example.backend.config;

import com.example.backend.auth.oauth2.handler.OAuth2LoginSuccessHandler;
import com.example.backend.auth.oauth2.service.CustomOAuth2UserService;
import com.example.backend.global.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // --- 1. CSRF, CORS, FormLogin 비활성화 ---
        http.csrf(AbstractHttpConfigurer::disable); // CSRF 비활성화
        http.formLogin(AbstractHttpConfigurer::disable); // 폼 로그인 비활성화
        http.httpBasic(AbstractHttpConfigurer::disable); // HTTP Basic 인증 비활성화

        // --- 2. H2 Console 설정 (개발용) ---
        // H2 Console이 frame으로 잘 표시되도록 X-Frame-Options 헤더 설정을 비활성화합니다.
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        // --- 3. 세션 관리 (STATELESS) ---
        // JWT 기반 인증을 사용하므로 세션을 STATELESS로 설정합니다.
        http.sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        // --- 4. 엔드포인트별 권한 설정 ---
        http.authorizeHttpRequests(authorize -> authorize
                // [필수] H2 콘솔 접근 허용
                .requestMatchers("/h2-console/**").permitAll()
                // [필수] 인증(회원가입/로그인) 관련 엔드포인트 허용
                .requestMatchers("/api/auth/**").permitAll()
                // [필수] OAuth 2.0 로그인 콜백 엔드포인트 허용
                .requestMatchers("/login/oauth2/code/**",
                        "/oauth2/authorization/**",
                        "/ws-stomp/",
                        "/pub/",
                        "/sub/").permitAll()
                // [선택] Swagger UI 등 문서 관련 엔드포인트 (필요시)
                // .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                // 그 외 모든 요청은 인증(로그인)이 필요합니다.
                .anyRequest().authenticated()
        );

        // --- 5. OAuth 2.0 로그인 설정 ---
        http.oauth2Login(oauth2 -> oauth2
                        // [필수] 로그인 성공 후 사용자 정보를 처리할 서비스 등록
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        // [필수] 로그인 성공 시 JWT를 발급할 핸들러 등록
                        .successHandler(oAuth2LoginSuccessHandler)
                // [선택] 로그인 실패 시 처리할 핸들러 (일단 주석 처리)
                // .failureHandler(oAuth2LoginFailureHandler)
        );

        // --- 6. JWT 필터 추가 ---
        // [필수] 모든 요청에 대해 JWT 인증 필터를 UsernamePasswordAuthenticationFilter 전에 실행합니다.
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // [선택] JWT 관련 예외 처리 핸들러 (만들어 둔 것이 있다면)
        // http.exceptionHandling(exceptions -> exceptions
        //         .authenticationEntryPoint(jwtAuthenticationEntryPoint)
        //         .accessDeniedHandler(jwtAccessDeniedHandler)
        // );

        return http.build();

    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}