package com.example.backend.user.service;

import com.example.backend.user.dto.ProfileResponseDto;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public ProfileResponseDto getProfile(String email) {
        User user = userRepository.findByEmail(email) // 이메일을 기준으로 사용자를 DB에서 확인
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));

        return new ProfileResponseDto(user);
    }
}
