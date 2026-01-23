package com.example.pg_spring.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.pg_spring.model.Room;
import com.example.pg_spring.model.Tenant;
import com.example.pg_spring.repository.RoomRepo;
import com.example.pg_spring.service.RoomService;

@Controller
@RestController
@RequestMapping("/rooms")
@CrossOrigin(origins = "http://localhost:4200")
public class RoomController {

    RoomService roomService;
    RoomRepo roomRepo;

    @Autowired
    public RoomController(RoomService roomService, RoomRepo roomRepo) {
        this.roomService = roomService;
        this.roomRepo = roomRepo;
    }

    @GetMapping("/pg-summary")
    public Map<String, Integer> getPgSummary() {

        Integer staying = roomRepo.totalOccupancy();
        Integer vacancy = roomRepo.totalVacancy();

        Map<String, Integer> response = new HashMap<>();
        response.put("totalStaying", staying == null ? 0 : staying);
        response.put("totalVacancy", vacancy == null ? 0 : vacancy);

        return response;
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        return ResponseEntity.status(200).body(rooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Integer id) {
        Room room = roomService.getRoomById(id);
        if (room == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(room);
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room createdRoom = roomService.createRoom(room);
        if (createdRoom == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(createdRoom);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Integer id, @RequestBody Room room) {
        Room updatedRoom = roomService.updateRoom(id, room);
        if (updatedRoom == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(updatedRoom);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable Integer id) {
        Boolean room = roomService.deleteRoom(id);
        if (room) {
            return ResponseEntity.status(200).body("Room deleted successfully");
        }
        return ResponseEntity.status(404).body("Room Not found");
    }

    @PostMapping("/assign/{roomId}/{tenantId}")
    public ResponseEntity<Tenant> assignRoomToTenant(@PathVariable Integer roomId, @PathVariable Integer tenantId) {
        Tenant tenant = roomService.assignTenantToRoom(roomId, tenantId);
        if (tenant == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(tenant);
    }

    @PostMapping("/vacate/{tenantId}")
    public ResponseEntity<Tenant> vacateRoomFromTenant(@PathVariable Integer tenantId) {
        Tenant vacated = roomService.vacateTenantFromRoom(tenantId);
        if (vacated == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(vacated);
    }
}
