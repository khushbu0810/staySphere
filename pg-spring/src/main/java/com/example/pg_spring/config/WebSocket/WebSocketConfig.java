package com.example.pg_spring.config.WebSocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        //frontend will come here
        config.enableSimpleBroker("/topic"); //broadcast message
        config.setApplicationDestinationPrefixes("/pg-app");

    }

    //websocket Endpoint which client use
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //main endpoint -> frontend connects here -> like: https://localhost:8080/chat
        registry.addEndpoint("/chat")
                .setAllowedOrigins("http://localhost:4200","https://pgrental-2.netlify.app")
                .withSockJS();
    }
}
