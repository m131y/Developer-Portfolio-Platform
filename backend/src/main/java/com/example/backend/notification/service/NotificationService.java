package com.example.backend.notification.service;

import com.example.backend.notification.dto.NotificationDto;
import com.example.backend.notification.entity.Notification;
import com.example.backend.notification.repository.NotificationRepository;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final NotificationRepository notificationRepository;
    private final ObjectMapper objectMapper; // DTO 객체를 JSON 문자열로 변환하는 데 사용

    private static final String REDIS_CHANNEL_PREFIX = "notification.user.";

    @Transactional
    public void sendNotification(String receiverId, NotificationDto notificationDto) {

        notificationDto.setReceiverId(receiverId);
        Notification savedNotification = notificationRepository.save(toEntity(receiverId, notificationDto));

        notificationDto.setId(savedNotification.getId());

        String channel = REDIS_CHANNEL_PREFIX + receiverId; // 예: notification.user.1

        try {
            String messageJson = objectMapper.writeValueAsString(notificationDto);

            redisTemplate.convertAndSend(channel, messageJson);
            log.info("Redis 채널에 알림 발행 성공. 채널: {}, 메시지: {}", channel, messageJson);

        } catch (JsonProcessingException e) {
            log.error("알림 DTO JSON 변환 오류: {}", e.getMessage());
        }
    }

    /**
     * 특정 사용자의 읽지 않은 알림 갯수를 가져오는 메서드
     */
    public long getUnreadNotificationCount(String userId) {
        return notificationRepository.countByReceiverIdAndIsReadFalse(Long.valueOf(userId));
    }

    /**
     * 알림을 읽음 처리하는 메서드 (클라이언트의 STOMP 요청 처리)
     */
    @Transactional
    public void markNotificationAsRead(Long notificationId, String userId) {
        notificationRepository.findById(notificationId)
                .ifPresent(notification -> {
                    if (notification.getReceiver().getId().equals(userId) && !notification.getIsRead()) {
                        notification.setIsRead(true);
                        notificationRepository.save(notification);
                        log.info("알림 ID {}를 읽음 처리했습니다.", notificationId);
                    }
                });
    }

    public List<NotificationDto> getNotifications(Long userId) {
        return notificationRepository.findAllByReceiverId(userId)
                .stream()
                .map(notification -> NotificationDto.fromEntity(notification))
                .toList();
    }

    private Notification toEntity(String receiverId, NotificationDto notificationDto) {
        User receiver = userRepository.findById(Long.valueOf(receiverId))
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));

        return Notification.builder()
                .receiver(receiver)
                .type(notificationDto.getType())
                .content(notificationDto.getContent())
                .relatedUrl(notificationDto.getRelatedUrl())
                .isRead(false) // 기본적으로 읽지 않은 상태로 저장
                .build();
    }
}
