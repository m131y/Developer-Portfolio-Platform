package com.example.backend.auth.controller;

import com.example.backend.auth.dto.LoginRequestDto;
import com.example.backend.auth.dto.SignUpRequestDto;
import com.example.backend.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth") // 이 컨트롤러의 모든 API는 /api/auth 주소로 시작
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup") // Post 요청 시 /api/auth/signup 주소로 받는다.
    public ResponseEntity<String> signUp(@RequestBody SignUpRequestDto requestDto) {
        authService.signUp(requestDto);
        return new ResponseEntity<>("회원가입에 성공하였습니다.", HttpStatus.CREATED);
    }

    // 로그인 API 메서드
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDto requestDto) {
        String token = authService.login(requestDto); // 서비스 호출
        return new ResponseEntity<>(token, HttpStatus.OK); // 토큰 반환
    }
}
