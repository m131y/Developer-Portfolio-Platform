package com.example.backend.message.dto;

import com.example.backend.message.entity.RoomParticipant;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RoomParticipantDto {
    private Long roomId;
    private Long userId;
    private LocalDateTime joinedAt;
    private LocalDateTime leftAt;

    public static RoomParticipantDto fromEntity(RoomParticipant roomParticipant) {
        return RoomParticipantDto.builder()
                .roomId(roomParticipant.getMessageRoom().getId())
                .userId(roomParticipant.getUser().getId())
                .joinedAt(roomParticipant.getJoinedAt())
                .leftAt(roomParticipant.getLeftAt())
                .build();
    }
}
