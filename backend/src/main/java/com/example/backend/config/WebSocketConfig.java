package com.example.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

//    private final StompInterceptor stompInterceptor;
//    private final AuthChannelInterceptor authChannelInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 1. 구독(Subscribe) 요청 Prefix:
        // 클라이언트가 메시지를 받을 때 사용하는 경로 (예: /topic/chat/room/1)
        // topic: 다수의 클라이언트에게 메시지를 브로드캐스팅할 때 사용 (채팅방, 공지)
        // queue: 특정 개인에게 1:1로 메시지를 보낼 때 사용 (개인 알림)
        config.enableSimpleBroker("/topic", "/queue");

        // 2. 발행(Publish) 요청 Prefix:
        // 클라이언트가 서버로 메시지를 보낼 때 사용하는 경로 (예: /app/chat/message)
        config.setApplicationDestinationPrefixes("/app");

        log.info("STOMP 메시지 브로커 설정 완료");
        log.info("- 구독 Prefix: /topic, /queue");
        log.info("- 발행 Prefix: /app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-stomp").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // 클라이언트에서 들어오는 메시지 채널에 Interceptor 등록
//         registration.interceptors(authChannelInterceptor);
//         registration.interceptors(stompInterceptor);
    }
}
