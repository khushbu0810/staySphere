package com.example.pg_spring.service.serviceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.pg_spring.model.Room;
import com.example.pg_spring.model.Tenant;
import com.example.pg_spring.repository.RoomRepo;
import com.example.pg_spring.repository.TenantRepo;
import com.example.pg_spring.service.RoomService;

@Service
public class RoomServiceImpl implements RoomService {

    RoomRepo roomRepo;
    TenantRepo tenantRepo;

    @Autowired
    public RoomServiceImpl(RoomRepo roomRepo, TenantRepo tenantRepo) {
        this.roomRepo = roomRepo;
        this.tenantRepo = tenantRepo;
    }

    @Override
    public Room createRoom(Room room) {
        room.setCurrentOccupancy(0);
        room.setVacancy(room.getCapacity());
        room.setIsAvailable(room.getVacancy() > 0);
        return roomRepo.save(room);
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepo.findAll();
    }

    @Override
    public Room getRoomById(Integer roomId) {
        Optional<Room> optRoom = roomRepo.findById(roomId);
        if (optRoom.isPresent()) {
            return optRoom.get();
        }
        return null;
    }

    @Override
    public Room updateRoom(Integer id, Room room) {
        Optional<Room> optRoom = roomRepo.findById(id);
        if (optRoom.isPresent()) {
            Room currentRoom = optRoom.get();
            currentRoom.setRoomNumber(room.getRoomNumber());
            currentRoom.setRoomType(room.getRoomType());
            currentRoom.setCurrentOccupancy(room.getCurrentOccupancy());
            currentRoom.setRentAmount(room.getRentAmount());
            currentRoom.setIsAvailable(room.getIsAvailable());
            currentRoom.setCapacity(room.getCapacity());
            return roomRepo.save(currentRoom);
        }
        return null;
    }

    @Override
    public Boolean deleteRoom(Integer id) {
        Optional<Room> optRoom = roomRepo.findById(id);
        if (optRoom.isEmpty()) {
            return false;
        }

        Room room = optRoom.get();

        List<Tenant> tenants = room.getTenants();
        if (tenants != null) {
            for (Tenant tenant : tenants) {
                tenant.setRoom(null);
                tenant.setOccupancyStatus("NOT_ASSIGNED");
                tenantRepo.save(tenant);
            }
            tenants.clear();
        }

        roomRepo.delete(room);
        return true;
    }

    @Override
    public Tenant assignTenantToRoom(Integer roomId, Integer tenantId) {
        Room currentRoom = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Tenant currentTenant = tenantRepo.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        if (currentRoom.getVacancy() <= 0) {
            throw new RuntimeException("Room is full");
        }

        currentTenant.setRoom(currentRoom);
        currentTenant.setOccupancyStatus("Living");

        if (currentRoom.getTenants() == null) {
            currentRoom.setTenants(new ArrayList<>());
        }
        currentRoom.getTenants().add(currentTenant);

        currentRoom.setCurrentOccupancy(currentRoom.getCurrentOccupancy() + 1);
        currentRoom.setVacancy(currentRoom.getCapacity() - currentRoom.getCurrentOccupancy());
        currentRoom.setIsAvailable(currentRoom.getVacancy() > 0);

        tenantRepo.save(currentTenant);
        roomRepo.save(currentRoom);
        return currentTenant;
    }

    @Override
    public Tenant vacateTenantFromRoom(Integer tenantId) {
        Optional<Tenant> optTenant = tenantRepo.findById(tenantId);
        if (optTenant.isEmpty()) {
            return null;
        }
        Tenant currentTenant = optTenant.get();

        Room currentRoom = currentTenant.getRoom();
        currentTenant.setRoom(null);
        currentTenant.setOccupancyStatus("Vacated");

        currentRoom.setCurrentOccupancy(currentRoom.getCurrentOccupancy() - 1);
        currentRoom.setVacancy(currentRoom.getCapacity() - currentRoom.getCurrentOccupancy());
        currentRoom.setIsAvailable(true);

        currentRoom.getTenants().remove(currentTenant);
        tenantRepo.save(currentTenant);
        roomRepo.save(currentRoom);
        return currentTenant;
    }
}
