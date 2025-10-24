package com.example.backend.message.dto;

import com.example.backend.message.entity.Message;
import com.example.backend.message.entity.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class MessageDto {

    // 메시지가 전송된 채팅방 ID
    private String roomId;

    // 메시지를 보낸 사람
    private String sender;

    // 메시지 타입 (입장, 퇴장, 대화 등 구분)
    private MessageType type;

    @NotBlank(message = "Message is required")
    @Size(max = 1000, message = "Message must not exceed 1000 characters")
    // 실제 메시지 내용
    private String message;

    // 메시지 전송 시각 (선택 사항이지만 유용함)
    private LocalDateTime createdAt;

    public static MessageDto fromEntity(Message message) {
        return MessageDto.builder()
                .roomId(message.getMessageRoom().getId().toString())
                .sender(message.getSender().getNickname())
                .type(message.getType())
                .message(message.getMessage())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
