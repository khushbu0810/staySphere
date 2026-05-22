package com.example.pg_spring.controller;

import com.example.pg_spring.model.Tenant;
import com.example.pg_spring.model.User;
import com.example.pg_spring.repository.TenantRepo;
import com.example.pg_spring.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:4200")
public class UserProfile {
    UserRepo userRepo;
    TenantRepo tenantRepo;

    @Autowired
    public UserProfile(UserRepo userRepo,TenantRepo tenantRepo){
        this.userRepo=userRepo;
        this.tenantRepo=tenantRepo;
    }

    @GetMapping
    public Tenant getLoggedInUSerDetails(Authentication authentication){
        String email=authentication.getName();
        User user=userRepo.findByEmail(email);
        return tenantRepo.findByUser(user);
    }
}
