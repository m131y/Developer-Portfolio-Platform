package com.example.backend.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class TechStackRequestDto {

    // ["Spring Boot", "React", "JPA"] 와 같이 기술 스택 '이름'의 리스트를 받습니다.
    private List<String> techNames;
}