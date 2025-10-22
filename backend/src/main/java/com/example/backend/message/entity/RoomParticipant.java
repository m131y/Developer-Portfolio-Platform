package com.example.backend.message.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "room_participants",
        uniqueConstraints = @UniqueConstraint(columnNames = {"room_id", "user_id"}))
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private MessageRoom messageRoom;

    // 💡 User (N:1 관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 💡 참가 시각 등 추가 정보 (선택적)
    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    // 💡 이탈 시각 (채팅방 나가기 기능 구현 시)
    @Column(name = "left_at")
    private LocalDateTime leftAt;
}
