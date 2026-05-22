package com.example.pg_spring.service.serviceImpl;

import com.example.pg_spring.model.ChatMessage;
import com.example.pg_spring.model.ChatMessageDTO;
import com.example.pg_spring.model.Room;
import com.example.pg_spring.model.Tenant;
import com.example.pg_spring.repository.ChatRepo;
import com.example.pg_spring.repository.TenantRepo;
import com.example.pg_spring.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {
    ChatRepo chatRepo;
    TenantRepo tenantRepo;
    SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatServiceImpl(ChatRepo chatRepo,TenantRepo tenantRepo, SimpMessagingTemplate messagingTemplate){
        this.chatRepo=chatRepo;
        this.messagingTemplate=messagingTemplate;
        this.tenantRepo=tenantRepo;
    }

    @Override
    public void sendMessage(ChatMessageDTO request) {
        System.out.println("SERVICE HIT");
        System.out.println("TENANT ID = " + request.getTenantId());
        Tenant tenant = tenantRepo.findById(request.getTenantId())
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        Room room = tenant.getRoom();

        ChatMessage message=new ChatMessage();
        message.setSender(tenant.getName());
        message.setReceiver("ADMIN");
        message.setMessage(request.getMessage());
        message.setTimestamp(LocalDateTime.now());
        message.setTenant(tenant);
        message.setRoom(room);

        ChatMessage savedMessage= chatRepo.save(message);
        System.out.println(message);
        messagingTemplate.convertAndSend("/topic/messages",savedMessage);
        System.out.println("Message sent");
    }

    @Override
    public List<ChatMessage> getOlderChats() {
        return chatRepo.findAllByOrderByTimestampAsc();
    }
}
