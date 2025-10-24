package com.example.backend.notification.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationDto {
    private String receiverId; // 메시지를 받을 사용자 ID
    private String content;    // 알림 내용
}
