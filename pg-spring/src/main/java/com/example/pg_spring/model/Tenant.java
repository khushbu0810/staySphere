package com.example.pg_spring.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Tenant {

    @Id
    @GeneratedValue
    private Integer id;
    private String name;
    private String phoneNumber;
    private String address;
    private LocalDate joinDate;
    private LocalDate endDate;
    private Double depositAmount;
    private String occupancyStatus; //living or vacated

    @ManyToOne
    @JsonIgnoreProperties("tenants")
    private Room room;

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }
}
