package com.example.pg_spring.service.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.pg_spring.model.Room;
import com.example.pg_spring.model.Tenant;
import com.example.pg_spring.repository.RoomRepo;
import com.example.pg_spring.repository.TenantRepo;
import com.example.pg_spring.service.TenantService;

import jakarta.transaction.Transactional;

@Service
public class TenantServiceImpl implements TenantService {

    TenantRepo tenantRepo;
    RoomRepo roomRepo;

    @Autowired
    public TenantServiceImpl(TenantRepo tenantRepo, RoomRepo roomRepo) {
        this.tenantRepo = tenantRepo;
        this.roomRepo = roomRepo;
    }

    @Override
    public Tenant addTenant(Tenant tenant) {
        tenant.setOccupancyStatus("Not_Assigned");
        tenant.setRoom(null);
        return tenantRepo.save(tenant);
    }

    @Override
    public List<Tenant> getAllTenants() {
        return tenantRepo.findAll();
    }

    @Override
    public Tenant getTenantById(Integer id) {
        Optional<Tenant> optTenant = tenantRepo.findById(id);
        if (optTenant.isPresent()) {
            return optTenant.get();
        }
        return null;
    }

    @Override
    public Tenant updateTenant(Integer id, Tenant tenant) {
        Optional<Tenant> optTenant = tenantRepo.findById(id);
        if (optTenant.isPresent()) {
            Tenant currentTenant = optTenant.get();
            currentTenant.setAddress(tenant.getAddress());
            currentTenant.setName(tenant.getName());
            currentTenant.setDepositAmount(tenant.getDepositAmount());
            currentTenant.setPhoneNumber(tenant.getPhoneNumber());
            currentTenant.setJoinDate(tenant.getJoinDate());
            currentTenant.setEndDate(tenant.getEndDate());
            currentTenant.setOccupancyStatus(tenant.getOccupancyStatus());
            return tenantRepo.save(currentTenant);
        }
        return null;
    }

    @Override
    @Transactional
    public Boolean deleteTenant(Integer id) {
        Optional<Tenant> optTenant = tenantRepo.findById(id);
        if (optTenant.isEmpty()) {
            return false;
        }
        Tenant tenant = optTenant.get();
        Room room = tenant.getRoom();
        if (room != null) {
            // 🔥 remove tenant from room
            room.getTenants().remove(tenant);
            // 🔥 update room stats
            room.setCurrentOccupancy(room.getCurrentOccupancy() - 1);
            room.setVacancy(room.getVacancy() + 1);
            room.setIsAvailable(true);
            // 🔥 break relationship
            tenant.setRoom(null);

            roomRepo.save(room);
        }

        tenantRepo.delete(tenant);
        return true;
    }

}
