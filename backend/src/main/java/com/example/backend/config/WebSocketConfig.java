package com.example.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

//    private final StompInterceptor stompInterceptor;
//    private final AuthChannelInterceptor authChannelInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 1. 구독(Subscribe) 요청 Prefix:
        // 클라이언트가 메시지를 받을 때 사용하는 경로 (예: /sub/chat/room/1)
        config.enableSimpleBroker("/sub");

        // 2. 발행(Publish) 요청 Prefix:
        // 클라이언트가 서버로 메시지를 보낼 때 사용하는 경로 (예: /pub/chat/message)
        config.setApplicationDestinationPrefixes("/pub");
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
