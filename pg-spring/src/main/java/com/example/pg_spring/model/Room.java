package com.example.pg_spring.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer roomNumber;
    private String roomType;
    private Integer capacity;
    private Integer currentOccupancy;
    private Integer vacancy;
    private Double rentAmount;
    private Boolean isAvailable;

    @OneToMany(mappedBy = "room")
    @JsonManagedReference
    @JsonIgnore
    private List<Tenant> tenants;

    @ElementCollection
    @Column(length = 1000)
    private List<String> roomImageUrls=new ArrayList<>();
}
