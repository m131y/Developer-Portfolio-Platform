package com.example.backend.redis;

import com.example.backend.message.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RedisPublisher {

    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * 채팅 메시지를 지정된 Redis Topic에 발행(Publish)합니다.
     * @param topicName 메시지를 발행할 Redis 채널 이름 (예: "chat.room.1")
     * @param message 발행할 ChatMessage 객체
     */
    public void publish(String topicName, MessageDto message) {
        // RedisTemplate을 사용하여 메시지를 Redis Topic에 발행합니다.
        // 이 메시지는 Redis를 구독하는 모든 서버의 RedisSubscriber로 전달됩니다.
        redisTemplate.convertAndSend(topicName, message);
    }

}
