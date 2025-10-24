package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings (CorsRegistry registry) {
        registry.addMapping("/**")
                // Allowed Frontend url
                .allowedOrigins("http://localhost:5173")
                // HTTP method allowed requirement
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                // Allow requirement Header
                .allowedHeaders("*")
                //Authorization Header Use
                .allowCredentials(true)
                //프리플라이트 요청 캐시 시간(초)
                .maxAge(3600);
    }
}
