package com.example.backend.user.entity;

import com.example.backend.message.entity.Message;
import com.example.backend.message.entity.MessageRoom;
import com.example.backend.message.entity.RoomParticipant;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    private String experience;

    @Lob // 'Large Object'의 약자, 긴 텍스트를 저장할 때 사용
    private String bio; // 소개글

    private String location; // 거주 지역(선택 사항)

    // 소셜 링크
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SocialLink> socialLinks = new ArrayList<>();

    // 사용자-기술 스택 매핑
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserTechStack> userTechStacks = new ArrayList<>();

    /**
     *  메세지 관련 연관관계 설정
     */

    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Message> sentMessages = new HashSet<>();

    @OneToMany(mappedBy = "creator", fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private Set<MessageRoom> createdRooms = new HashSet<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private Set<RoomParticipant> roomParticipants = new HashSet<>();


    /**
     * 소셜 링크를 추가합니다. (양방향 연관관계 설정)
     */
    public void addSocialLink(SocialLink socialLink) {
        this.socialLinks.add(socialLink);
        socialLink.setUser(this);
    }

    /**
     * 기술 스택을 추가합니다. (양방향 연관관계 설정)
     */
    public void addUserTechStack(UserTechStack userTechStack) {
        this.userTechStacks.add(userTechStack);
        userTechStack.setUser(this);
    }
}
