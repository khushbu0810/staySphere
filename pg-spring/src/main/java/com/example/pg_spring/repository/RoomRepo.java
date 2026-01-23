package com.example.pg_spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.pg_spring.model.Room;

public interface RoomRepo extends JpaRepository<Room, Integer> {

    @Query("select sum(r.currentOccupancy) from Room r")
    Integer totalOccupancy();

    @Query("select sum(r.vacancy) from Room r")
    Integer totalVacancy();
}
