package com.example.pg_spring.service;

import java.util.List;

import com.example.pg_spring.model.Room;
import com.example.pg_spring.model.Tenant;

public interface RoomService {

    Room createRoom(Room room);

    List<Room> getAllRooms();

    Room getRoomById(Integer roomId);

    Room updateRoom(Integer id, Room room);

    Boolean deleteRoom(Integer id);

    Tenant assignTenantToRoom(Integer roomId, Integer tenantId);

    Tenant vacateTenantFromRoom(Integer tenantId);
}
