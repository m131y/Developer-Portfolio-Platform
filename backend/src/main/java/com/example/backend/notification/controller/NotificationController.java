package com.example.backend.notification.controller;

import com.example.backend.notification.dto.NotificationDto;
import com.example.backend.notification.repository.NotificationRepository;
import com.example.backend.notification.service.NotificationService;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class NotificationController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    @MessageMapping("/notification/read")
    public void handleNotificationReadRequest(Long notificationId, @AuthenticationPrincipal User user) {
        String userId = String.valueOf(user.getId());

        notificationService.markNotificationAsRead(notificationId, userId);
        long newUnreadCount = notificationService.getUnreadNotificationCount(userId);
        simpMessagingTemplate.convertAndSendToUser(userId, "/queue/count", newUnreadCount);
    }

    @MessageMapping("/notification/count")
    public void getUnreadCount(@AuthenticationPrincipal User user) {
        String userId = String.valueOf(user.getId());

        long count = notificationService.getUnreadNotificationCount(userId);
        simpMessagingTemplate.convertAndSendToUser(userId, "/queue/count", count);
    }

    @GetMapping("/api/notification/{userId}")
    public List<NotificationDto> getNotifications (@PathVariable Long userId) {
        return notificationService.getNotifications(userId);
    }

}
