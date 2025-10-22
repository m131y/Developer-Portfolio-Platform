package com.example.backend.config;

import com.example.backend.redis.RedisSubscriber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Value("${REDIS_HOST}")
    private String host;

    @Value("${REDIS_PORT}")
    private int port;

    // 1. Redis 연결 정보 설정 (Host, Port 등)
    // application.properties에서 설정한 정보를 기반으로 연결 객체를 만듭니다.
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(
                new RedisStandaloneConfiguration(
                        host, port // application.properties의 값으로 대체 가능
                )
        );
    }

    // 2. Redis 명령어 실행 도구 (RedisTemplate) 설정
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();

        redisTemplate.setConnectionFactory(connectionFactory);

        // Key 직렬화 (Redis에 저장되는 Key를 String으로 변환)
        redisTemplate.setKeySerializer(new StringRedisSerializer());

        // Value 직렬화 (메시지 내용 같은 Value를 JSON 형태로 변환)
        // Spring의 기본 직렬화 대신 JSON 변환을 사용하면 객체 형태로 주고받기 편합니다.
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));

        return redisTemplate;
    }

    /**
     * Redis 메시지 리스너 컨테이너 설정
     */
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory,
            MessageListenerAdapter listenerAdapter // 3.2에서 만들 리스너 어댑터
    ) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        // 여기에 구독할 토픽(채널)을 지정하여 리스너 어댑터를 등록합니다.
        // "chat.*" 패턴으로 시작하는 모든 채널을 구독하겠다는 의미
        container.addMessageListener(listenerAdapter, new PatternTopic("chat.room.*"));

        return container;
    }

    /**
     * 수신된 메시지를 실제로 처리할 리스너 어댑터
     * (이 어댑터가 실제 비즈니스 로직을 가진 서비스 클래스로 메시지를 넘김)
     */
    @Bean
    public MessageListenerAdapter listenerAdapter(RedisSubscriber redisSubscriber) {
        // RedisSubscriber 클래스의 'sendMessage' 메서드가 메시지 수신 시 실행됨
        return new MessageListenerAdapter(redisSubscriber, "sendMessage");
    }

}

