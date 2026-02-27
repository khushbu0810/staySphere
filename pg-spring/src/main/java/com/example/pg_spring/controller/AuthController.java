package com.example.pg_spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.pg_spring.model.LoginDTO;
import com.example.pg_spring.model.User;
import com.example.pg_spring.service.UserService;

@RestController
@RequestMapping
public class AuthController {

    UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User newUser = userService.createUser(user);
        if (newUser == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginDTO> login(@RequestBody User user) {
        LoginDTO loginDTO = userService.loginUser(user);
        if (loginDTO == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(loginDTO);
    }
}
