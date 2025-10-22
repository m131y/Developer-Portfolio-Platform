package com.example.backend.message.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "message_rooms")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_name")
    private String roomName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_user_id", nullable = false)
    private User creator;

    // 💡 참가자 목록 (N:M 관계 해소)
    @OneToMany(mappedBy = "messageRoom", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<RoomParticipant> participants;

    // 💡 메시지 목록 (Message 엔티티의 messageRoom 필드를 매핑)
    @OneToMany(mappedBy = "messageRoom", fetch = FetchType.LAZY)
    @JsonIgnore // <--- 이 필드를 JSON 변환에서 제외
    private Set<Message> messages;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

}
