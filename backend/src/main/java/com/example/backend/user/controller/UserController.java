package com.example.backend.user.controller;

import com.example.backend.user.dto.ProfileResponseDto;
import com.example.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    // 프로필 조회 API
    @GetMapping("/profile")
    // 현재 로그인된 사용자의 이메일을 알아서 꺼내와 email 변수에 넣어준다.
    public ResponseEntity<ProfileResponseDto> getMyProfile(@AuthenticationPrincipal String email) {
        ProfileResponseDto profile = userService.getProfile(email);

        return ResponseEntity.ok(profile);
    }
}
