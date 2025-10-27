package com.example.backend.redis;

import com.example.backend.message.dto.MessageDto;
import com.example.backend.notification.dto.NotificationDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;


@Service
@Slf4j
public class RedisSubscriber implements MessageListener{

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;
    private final StringRedisSerializer stringSerializer = new StringRedisSerializer();

    @Autowired
    public RedisSubscriber(@Qualifier("simpMessagingTemplate") SimpMessagingTemplate messagingTemplate, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;

        log.info("✅ SimpMessagingTemplate 주입 확인: Class = {}", messagingTemplate.getClass().getName());
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            // 1. 메시지 바디를 문자열(JSON)로 디코딩
            String messageBody = stringSerializer.deserialize(message.getBody());
            // 2. 채널 패턴을 문자열로 디코딩
            String channel = new String(pattern, StandardCharsets.UTF_8);

            log.info("Redis Message received - Channel: {}, Body: {}", channel, messageBody);

            if (channel.startsWith("chat.room.")) {
                // 3. 채팅 메시지 처리 (DB 2번)
                handleChatMessage(messageBody);

            } else if (channel.startsWith("notification.user.")) {
                // 4. 알림 메시지 처리 (DB 3번)
                handleNotificationMessage(messageBody);
            }

        } catch (Exception e) {
            log.error("Error processing Redis message: {}", e.getMessage(), e);
        }
    }

    /**
     * 채팅 메시지 처리 로직
     */
    private void handleChatMessage(String messageBody) throws JsonProcessingException {
        MessageDto messageDto = objectMapper.readValue(messageBody, MessageDto.class);

        // STOMP 경로로 전송
        String destination = "/topic/chat/room/" + messageDto.getRoomId();

        // /topic 경로는 구독한 모든 클라이언트에게 메시지를 브로드캐스팅합니다.
        // 메시지 바디를 그대로 전송하거나, 다시 ChatMessage 객체를 전송합니다.
        messagingTemplate.convertAndSend(destination, messageDto);
        //messagingTemplate.convertAndSend(destination, messageBody);
        log.info("Sent Chat Message to WebSocket destination: {}", destination);
    }

    /**
     * 알림 메시지 처리 로직
     */
    private void handleNotificationMessage(String messageBody) throws JsonProcessingException {
        String actualJsonBody = objectMapper.readValue(messageBody, String.class);

        NotificationDto notificationDto = objectMapper.readValue(actualJsonBody, NotificationDto.class);

        // STOMP 경로로 전송
        String destination = "/queue/notifications";

        // 1:1 메시징은 convertAndSendToUser를 사용해야 합니다.
        String receiverId = notificationDto.getReceiverId();

        messagingTemplate.convertAndSendToUser(receiverId, destination, notificationDto);
        log.info("Sent Notification to user {} at WebSocket destination: /user{}", receiverId, destination);
    }
}