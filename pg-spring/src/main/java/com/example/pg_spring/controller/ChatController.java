package com.example.pg_spring.controller;

import com.example.pg_spring.model.ChatMessage;
import com.example.pg_spring.model.ChatMessageDTO;
import com.example.pg_spring.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Controller
@RestController
public class ChatController {
    ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService){
        this.chatService=chatService;
    }

    //complete url -> pg-app/sendMessage
    @MessageMapping("/sendMessage")
    public void sendMessage(ChatMessageDTO message){
        System.out.println(message);
        System.out.println(message.getTenantId());
        System.out.println("CONTROLLER HIT");
        chatService.sendMessage(message);
    }

    @GetMapping("/messages")
    public List<ChatMessage> getOlderChats(){
        return chatService.getOlderChats();
    }
}
