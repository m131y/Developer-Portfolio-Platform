package com.example.backend.user.service;

import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceTx {

    private final UserRepository userRepository;

    /**
     * 새로운 트랜잭션을 시작하여 사용자를 저장하고 즉시 커밋합니다. (REQUIRES_NEW)
     * 이렇게 해야 CustomOAuth2UserService의 저장 내용이 SuccessHandler에서 바로 조회 가능합니다.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public User saveNewUser(User user) {
        return userRepository.save(user);
    }
}