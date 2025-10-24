package com.example.backend.notification.dto;

import com.example.backend.notification.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private String receiverId;
    private String type;
    private String content;
    private String relatedUrl;
    private boolean isRead;
    private LocalDateTime createdAt;

    public NotificationDto fromEntity(Notification notification) {
        return NotificationDto.builder()
                .receiverId(notification.getReceiver().getId().toString())
                .type(notification.getType())
                .content(notification.getContent())
                .relatedUrl(notification.getRelatedUrl())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
