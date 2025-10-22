package com.example.backend.user.repository;

import com.example.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);

    Optional<User> findByEmailAndProvider(String email, String provider); // 이메일로 사용자를 찾기 위한 메서드

    Optional<User> findByEmail(String email); // provider와 상관없이 이메일로 사용자를 찾기 위한 메서드
}
