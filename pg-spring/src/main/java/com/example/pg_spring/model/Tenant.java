package com.example.pg_spring.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String phoneNumber;
    private String email;
    private String address;
    private LocalDate joinDate;
    private LocalDate endDate;
    private Double depositAmount;
    private String occupancyStatus; //living or vacated
    private Boolean rentPaid;
    @Column(length = 1000)
    private String profileImageUrl;
    @Column(length = 1000)
    private String identityProofUrl;

    @ManyToOne
    @JsonIgnoreProperties("tenants")
    private Room room;

    @ManyToOne
    private User user;

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }
}
