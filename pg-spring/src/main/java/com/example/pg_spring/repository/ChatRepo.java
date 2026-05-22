package com.example.pg_spring.repository;

import com.example.pg_spring.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepo extends JpaRepository<ChatMessage,Integer> {
    List<ChatMessage> findAllByOrderByTimestampAsc();
}
