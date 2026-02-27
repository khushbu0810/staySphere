package com.example.pg_spring.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
    private List<Tenant> tenants;
}
