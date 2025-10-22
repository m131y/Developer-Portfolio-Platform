package com.example.backend.redis;

import com.example.backend.message.dto.MessageDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class RedisSubscriber implements MessageListener {

    // WebSocket으로 클라이언트에게 메시지를 보내기 위한 도구
    private final SimpMessagingTemplate messagingTemplate;

    // RedisTemplate에서 Value 직렬화 시 사용한 것과 동일한 JSON 직렬화 객체
    private final ObjectMapper objectMapper;

    /**
     * Redis에서 메시지를 수신할 때마다 MessageListenerAdapter에 의해 호출되는 메서드
     * (RedisConfig에서 sendMessage로 이름을 지정했기 때문에 이 이름으로 사용합니다)
     */
//    public void sendMessage(String publishMessage) {
//        try {
//            // 1. 수신된 JSON 문자열 메시지를 채팅 메시지 객체로 변환
//            ChatMessage chatMessage = objectMapper.readValue(publishMessage, ChatMessage.class);
//
//            // 2. WebSocket 클라이언트에게 메시지 전송
//            // "/sub/chat/room/{roomId}" 주소를 구독하고 있는 모든 클라이언트에게 메시지를 보냅니다.
//            String destination = "/sub/chat/room/" + chatMessage.getRoomId();
//
//            // messagingTemplate을 통해 WebSocket으로 메시지 전송
//            messagingTemplate.convertAndSend(destination, chatMessage);
//
//        } catch (Exception e) {
//            // 메시지 변환 또는 전송 오류 처리
//            log.error("Redis 메시지 처리 오류: {}", e.getMessage());
//        }
//    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            log.info("Redis 메시지 수신 성공!");
            // 1. Redis 메시지의 본문(Body)을 바이트 배열로 추출합니다.
            byte[] body = message.getBody();

            // 2. 바이트 배열을 String으로 변환합니다. (Redis 직렬화 방식에 따라 달라집니다)
            // String content = new String(body); // 또는 redisSerializer.deserialize(body);

            // 💡 바이트 배열을 ObjectMapper.readValue()로 직접 처리합니다.
            MessageDto messageDto = objectMapper.readValue(body, MessageDto.class);

            // 3. STOMP 클라이언트에게 메시지 발행
            String destination = "/sub/chat/room/" + messageDto.getRoomId();
            messagingTemplate.convertAndSend(destination, messageDto);

        } catch (Exception e) {
            // 오류 발생 시 로그 기록
            log.error("Redis 메시지 역직렬화 또는 전달 오류: {}", e.getMessage(), e);
        }
    }
}
