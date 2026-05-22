package com.example.pg_spring.service;

import com.example.pg_spring.model.ChatMessage;
import com.example.pg_spring.model.ChatMessageDTO;

import java.util.List;

public interface ChatService {
    void sendMessage(ChatMessageDTO message);
    List<ChatMessage> getOlderChats();
}
