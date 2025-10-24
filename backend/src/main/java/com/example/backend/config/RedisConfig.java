package com.example.backend.config;

import com.example.backend.redis.RedisSubscriber;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
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


    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
        redisStandaloneConfiguration.setHostName(host);
        redisStandaloneConfiguration.setPort(port);
        return new LettuceConnectionFactory(redisStandaloneConfiguration);
    }

    /**
     * RedisTemplate(Redis 명령어 실행 도구) 설정
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(@Qualifier("redisConnectionFactory") RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();

        redisTemplate.setConnectionFactory(connectionFactory);

        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));

        return redisTemplate;
    }

    /**
     * chat 기능은 redis 의 2번 DB로 분리
     */
    @Bean
    @Qualifier("chatPubSub")
    public RedisConnectionFactory chatPubSubFactory() {
        RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration();
        configuration.setHostName(host);
        configuration.setPort(port);
        configuration.setDatabase(2);
        return new LettuceConnectionFactory(configuration);
    }

    /**
     * notification 기능은 redis 의 3번 DB로 분리
     */
    @Bean
    @Qualifier("notificationPubSub")
    public RedisConnectionFactory notificationPubSubFactory() {
        RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration();
        configuration.setHostName(host);
        configuration.setPort(port);
        configuration.setDatabase(3);
        return new LettuceConnectionFactory(configuration);
    }

    /**
     * chat 기능의 RedisTemplate
     */
    @Bean
    @Qualifier("chatRedisTemplate")
    RedisTemplate<String, Object> chatRedisTemplate(@Qualifier("chatPubSub") RedisConnectionFactory chatPubSubFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(chatPubSubFactory);

        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));

        return redisTemplate;
    }

    /**
     * notification 기능의 RedisTemplate
     */
    @Bean
    @Qualifier("notificationRedisTemplate")
    RedisTemplate<String, Object> notificationRedisTemplate(@Qualifier("notificationPubSub") RedisConnectionFactory notificationPubSubFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(notificationPubSubFactory);

        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));

        return redisTemplate;
    }


    @Bean
    public MessageListenerAdapter sharedAdapter(RedisSubscriber redisSubscriber) {
        return new MessageListenerAdapter(redisSubscriber);
    }

    /**
     * chat 기능 Redis 메시지 리스너 컨테이너 설정
     */
    @Bean
    public RedisMessageListenerContainer chatMessageListenerContainer(@Qualifier("chatPubSub") RedisConnectionFactory chatPubSubFactory,
                                                                      MessageListenerAdapter sharedAdapter) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(chatPubSubFactory);
        container.addMessageListener(sharedAdapter, new PatternTopic("chat.room.*"));

        return container;
    }

    /**
     * notification 기능 Redis 메시지 리스너 컨테이너 설정
     */
    @Bean
    public RedisMessageListenerContainer notificationMessageListenerContainer(
            @Qualifier("notificationPubSub") RedisConnectionFactory notificationPubSubFactory,
            MessageListenerAdapter sharedAdapter) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(notificationPubSubFactory);
        container.addMessageListener(sharedAdapter, new PatternTopic("notification.user.*"));

        return container;
    }
}

