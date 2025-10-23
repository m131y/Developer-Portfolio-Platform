package com.example.backend.user.controller;

import com.example.backend.user.dto.ProfileResponseDto;
import com.example.backend.user.dto.ProfileUpdateRequestDto; // <-- 추가된 import
import com.example.backend.user.dto.SocialLinkRequestDto;
import com.example.backend.user.dto.TechStackRequestDto;
import com.example.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    /**
     * 프로필 조회 API
     * [GET] /api/user/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<ProfileResponseDto> getMyProfile(@AuthenticationPrincipal String email) {
        ProfileResponseDto profile = userService.getProfile(email);
        return ResponseEntity.ok(profile);
    }

    /**
     * 프로필 수정 API
     * [PUT] /api/user/profile
     */
    @PutMapping("/profile")
    public ResponseEntity<ProfileResponseDto> updateProfile(
            @AuthenticationPrincipal String email,
            @RequestBody ProfileUpdateRequestDto requestDto
    ) {
        ProfileResponseDto updatedProfile = userService.updateProfile(email, requestDto);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * 소셜 링크 수정 API
     * [PUT] /api/user/profile/links
     */
    @PutMapping("/profile/links")
    public ResponseEntity<ProfileResponseDto> updateSocialLinks(
            @AuthenticationPrincipal String email,
            @RequestBody List<SocialLinkRequestDto> socialLinksDto
    ) {
        ProfileResponseDto updatedProfile = userService.updateSocialLinks(email, socialLinksDto);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * 기술 스택 수정 API
     * [PUT] /api/user/profile/techstacks
     */
    @PutMapping("/profile/techstacks")
    public ResponseEntity<ProfileResponseDto> updateTechStacks(
            @AuthenticationPrincipal String email,
            @RequestBody TechStackRequestDto requestDto
    ) {
        ProfileResponseDto updatedProfile = userService.updateTechStacks(email, requestDto);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * 프로필 이미지 업로드/수정 API
     * [POST] /api/user/profile/image
     * (파일 업로드는 PUT/PATCH보다 POST가 표준)
     */
    @PostMapping("/profile/image")
    public ResponseEntity<ProfileResponseDto> updateProfileImage(
            @AuthenticationPrincipal String email,
            @RequestParam("image") MultipartFile file
    ) throws IOException {

        ProfileResponseDto updatedProfile = userService.updateProfileImage(email, file);
        return ResponseEntity.ok(updatedProfile);
    }
}