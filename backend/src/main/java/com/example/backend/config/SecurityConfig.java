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
        return http
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.disable())
                )
                .authorizeHttpRequests(authorize -> authorize
                // H2 콘솔 관련 경로는 인증 없이 접근을 허용합니다.
                .requestMatchers(
                        "/h2-console/**",
                        "/ws-stomp/**",
                        "/pub/**",
                        "/sub/**"
                ).permitAll()
                // 그 외 모든 요청도 인증 없이 접근을 허용합니다. (개발 편의상)
                .anyRequest().permitAll()

        ).build();

    }
}