package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // 모든 요청에 대한 인가(권한 부여) 설정을 시작합니다.
        http.authorizeHttpRequests(authorize -> authorize
                // H2 콘솔 관련 경로는 인증 없이 접근을 허용합니다.
                .requestMatchers("/h2-console/**").permitAll()
                // 그 외 모든 요청도 인증 없이 접근을 허용합니다. (개발 편의상)
                .anyRequest().permitAll()
        );

        // H2 Console은 frame 기반으로 동작하므로, CSRF 토큰 검사를 비활성화합니다.
        // 이는 개발 환경에서만 적용하며, 운영 환경에서는 반드시 활성화해야 합니다.
        http.csrf(AbstractHttpConfigurer::disable);

        // H2 Console이 frame으로 잘 표시되도록 X-Frame-Options 헤더 설정을 비활성화합니다.
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        return http.build();
    }
}