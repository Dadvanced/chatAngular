package com.dadvanced.springboot.backend.chat;	

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	private static final String ENDPOINT = "/chat-websocket";
	//private static final String PORT = "http://localhost:4200"; // puerto estandar
	private static final String PORT = "http://192.168.0.250:4200"; // para entrar por aquí necesitamos hacer un ng serve --host=0.0.0.0 --disable-host-check
	//private static final String PORT = "188.85.204.178:4200";
	
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint(ENDPOINT).setAllowedOrigins(PORT).withSockJS();
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker("/chat/"); // prefijo de eventos
		registry.setApplicationDestinationPrefixes("/app"); // prefijo de la app
	}

	
}
