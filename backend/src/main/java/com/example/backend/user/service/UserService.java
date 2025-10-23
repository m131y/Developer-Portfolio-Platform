package com.example.backend.user.service;

import com.example.backend.common.s3.S3UploadService;
import com.example.backend.user.dto.ProfileResponseDto;
import com.example.backend.user.dto.ProfileUpdateRequestDto;
import com.example.backend.user.dto.SocialLinkRequestDto;
import com.example.backend.user.dto.TechStackRequestDto;
import com.example.backend.user.entity.SocialLink;
import com.example.backend.user.entity.TechStack;
import com.example.backend.user.entity.User;
import com.example.backend.user.entity.UserTechStack;
import com.example.backend.user.repository.TechStackRepository;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final TechStackRepository techStackRepository;
    private final S3UploadService s3UploadService;

    /**
     * 프로필 조회
     */
    public ProfileResponseDto getProfile(String email) {
        User user = findUserByEmail(email);
        return new ProfileResponseDto(user);
    }

    /**
     * 프로필 수정 (기본 정보)
     */
    @Transactional
    public ProfileResponseDto updateProfile(String email, ProfileUpdateRequestDto requestDto) {
        User user = findUserByEmail(email);
        user.setNickname(requestDto.getNickname());
        user.setJob(requestDto.getJob());
        user.setExperience(requestDto.getExperience());
        user.setBio(requestDto.getBio());
        user.setLocation(requestDto.getLocation());
        user.setProfileImageUrl(requestDto.getProfileImageUrl());

        return new ProfileResponseDto(user);
    }

    /**
     * 소셜 링크 수정
     */
    @Transactional
    public ProfileResponseDto updateSocialLinks(String email, List<SocialLinkRequestDto> socialLinksDto) {
        User user = findUserByEmail(email);
        user.getSocialLinks().clear();

        for (SocialLinkRequestDto linkDto : socialLinksDto) {
            SocialLink newLink = new SocialLink();
            newLink.setLinkType(linkDto.getLinkType());
            newLink.setUrl(linkDto.getUrl());
            user.addSocialLink(newLink);
        }
        return new ProfileResponseDto(user);
    }

    /**
     * 기술 스택 수정
     */
    @Transactional
    public ProfileResponseDto updateTechStacks(String email, TechStackRequestDto requestDto) {
        User user = findUserByEmail(email);
        user.getUserTechStacks().clear();

        for (String techName : requestDto.getTechNames()) {
            TechStack techStack = techStackRepository.findByTechName(techName)
                    .orElseGet(() -> {
                        TechStack newTechStack = new TechStack();
                        newTechStack.setTechName(techName);
                        return techStackRepository.save(newTechStack);
                    });

            UserTechStack userTechStack = new UserTechStack();
            userTechStack.setTechStack(techStack);
            user.addUserTechStack(userTechStack);
        }
        return new ProfileResponseDto(user);
    }

    /**
     * 프로필 이미지 업로드/수정
     * @param email (로그인된 사용자의 이메일)
     * @param file (업로드할 이미지 파일)
     */
    @Transactional
    public ProfileResponseDto updateProfileImage(String email, MultipartFile file) throws IOException {
        User user = findUserByEmail(email);
        String imageUrl = s3UploadService.uploadFile(file);
        user.setProfileImageUrl(imageUrl);

        return new ProfileResponseDto(user);
    }

    /**
     * (공통 메서드) 이메일로 사용자 찾기
     */
    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다: " + email));
    }
}