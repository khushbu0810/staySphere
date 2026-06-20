package com.example.pg_spring.service.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.pg_spring.model.Room;
import com.example.pg_spring.model.Tenant;
import com.example.pg_spring.model.User;
import com.example.pg_spring.repository.RoomRepo;
import com.example.pg_spring.repository.TenantRepo;
import com.example.pg_spring.repository.UserRepo;
import com.example.pg_spring.service.TenantService;

import jakarta.transaction.Transactional;

@Service
public class TenantServiceImpl implements TenantService {

    TenantRepo tenantRepo;
    RoomRepo roomRepo;
    UserRepo userRepo;
    PasswordEncoder passwordEncoder;
//    RedisService redisService;

    @Autowired
    public TenantServiceImpl(TenantRepo tenantRepo, RoomRepo roomRepo, UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.tenantRepo = tenantRepo;
        this.roomRepo = roomRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
//        this.redisService = redisService;
    }

    @Override
    public Tenant addTenant(Tenant tenant) {
        if (userRepo.existsByEmail(tenant.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setUsername(tenant.getName());
        user.setPassword(passwordEncoder.encode(tenant.getPhoneNumber()));
        user.setEmail(tenant.getEmail());
        user.setAccountStatus(true);
        user.setRole("USER");
        User savedUser = userRepo.save(user);
        tenant.setUser(savedUser);
        tenant.setOccupancyStatus("Not_Assigned");
        tenant.setRoom(null);
        tenant.setRentPaid(false);
        return tenantRepo.save(tenant);
    }

    @Override
    public List<Tenant> getAllTenants() {
        return tenantRepo.findAll();
//        List<Tenant> cachedTenants=redisService.get("allTenants", new TypeReference<List<Tenant>>() {});
//        if(cachedTenants!=null){
//            System.out.println("Data fetched from Redis");
//            return cachedTenants;
//        }else{
//            System.out.println("Data fetched from Database");
//            List<Tenant> tenants=tenantRepo.findAll();
//            redisService.set("allTenants",tenants,300L);
//            return tenants;
//        }
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
            Tenant updatedTenant
                    = tenantRepo.save(currentTenant);
            // remove old cache
//            redisService.delete("allTenants");
            return updatedTenant;
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
            room.setCurrentOccupancy(0);
            room.setVacancy(1);
            room.setIsAvailable(true);
            // 🔥 break relationship
            tenant.setRoom(null);

            roomRepo.save(room);
        }

        tenantRepo.delete(tenant);
        return true;
    }

    @Override
    public Tenant toggleRentPayment(Integer tenantId) {
        Tenant tenant = tenantRepo.findById(tenantId).orElse(null);
        if (tenant == null || tenant.getRoom() == null) {
            return null;
        }
        boolean current = Boolean.TRUE.equals(tenant.getRentPaid());
        tenant.setRentPaid(!current);
        return tenantRepo.save(tenant); // 🔥 REQUIRED
    }

    @Override
    public byte[] generateMonthTenantReport(int year, int month) {

        List<Tenant> tenants = tenantRepo.findAll();

        StringBuilder csv = new StringBuilder();
        csv.append("Tenant Name,Room No,Status,Rent Paid,Join Date,End Date,Category\n");

        for (Tenant t : tenants) {

            boolean joinedInMonth
                    = t.getJoinDate() != null
                    && t.getJoinDate().getYear() == year
                    && t.getJoinDate().getMonthValue() == month;

            boolean vacatedInMonth
                    = "vacated".equalsIgnoreCase(t.getOccupancyStatus())
                    && t.getEndDate() != null
                    && t.getEndDate().getYear() == year
                    && t.getEndDate().getMonthValue() == month;

            boolean isLiving
                    = "living".equalsIgnoreCase(t.getOccupancyStatus());

            if (joinedInMonth || vacatedInMonth || isLiving) {

                String category;

                if (joinedInMonth) {
                    category = "New Joinee (" + year + "-" + month + ")";
                } else if (vacatedInMonth) {
                    category = "Vacated (" + year + "-" + month + ")";
                } else if (Boolean.TRUE.equals(t.getRentPaid())) {
                    category = "Rent Paid";
                } else {
                    category = "Rent Not Paid";
                }

                csv.append(t.getName()).append(",")
                        .append(t.getRoom() != null ? t.getRoom().getRoomNumber() : "-").append(",")
                        .append(t.getOccupancyStatus()).append(",")
                        .append(Boolean.TRUE.equals(t.getRentPaid()) ? "Yes" : "No").append(",")
                        .append(t.getJoinDate()).append(",")
                        .append(t.getEndDate() != null ? t.getEndDate() : "-").append(",")
                        .append(category)
                        .append("\n");
            }
        }

        return csv.toString().getBytes();
    }

    @Override
    public byte[] generateYearTenantReport(int year) {

        List<Tenant> tenants = tenantRepo.findAll();

        StringBuilder csv = new StringBuilder();
        csv.append("Tenant Name,Room No,Status,Rent Paid,Join Date,End Date,Category\n");

        for (Tenant t : tenants) {

            boolean joinedInYear
                    = t.getJoinDate() != null
                    && t.getJoinDate().getYear() == year;

            boolean vacatedInYear
                    = "vacated".equalsIgnoreCase(t.getOccupancyStatus())
                    && t.getEndDate() != null
                    && t.getEndDate().getYear() == year;

            boolean isLiving
                    = "living".equalsIgnoreCase(t.getOccupancyStatus());

            if (joinedInYear || vacatedInYear || isLiving) {

                String category;

                if (joinedInYear) {
                    category = "New Joinee (" + year + ")";
                } else if (vacatedInYear) {
                    category = "Vacated (" + year + ")";
                } else if (Boolean.TRUE.equals(t.getRentPaid())) {
                    category = "Rent Paid";
                } else {
                    category = "Rent Not Paid";
                }

                csv.append(t.getName()).append(",")
                        .append(t.getRoom() != null ? t.getRoom().getRoomNumber() : "-").append(",")
                        .append(t.getOccupancyStatus()).append(",")
                        .append(Boolean.TRUE.equals(t.getRentPaid()) ? "Yes" : "No").append(",")
                        .append(t.getJoinDate()).append(",")
                        .append(t.getEndDate() != null ? t.getEndDate() : "-").append(",")
                        .append(category)
                        .append("\n");
            }
        }

        return csv.toString().getBytes();
    }

    @Override
    public Optional<Tenant> getTenantByUserId(Integer userId) {
        return tenantRepo.findByUserUserId(userId);
    }

}
