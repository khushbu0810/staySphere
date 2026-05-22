package com.example.pg_spring.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String sender;
    private String receiver;
    private String message;
    private LocalDateTime timestamp;
    //from which room
    @ManyToOne
    @JsonIgnoreProperties({"tenants"})
    private Room room;
    @ManyToOne
    private Tenant tenant;
}
