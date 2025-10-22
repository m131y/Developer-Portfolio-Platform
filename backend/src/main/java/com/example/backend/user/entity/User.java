package com.example.backend.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
@Builder
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID 값을 자동으로 생성
    private Long id;

    @Column(nullable = false, unique = true) // null 값 허용 x, 중복된 값 허용 x
    private String email;

    @Column(nullable = true)
    private String password;

    @Column(nullable = false, unique = true)
    private String nickname;

    private String job;

    private String profileImageUrl;

    private String role = "ROLE_USER";

    private String provider; // github, google
}
