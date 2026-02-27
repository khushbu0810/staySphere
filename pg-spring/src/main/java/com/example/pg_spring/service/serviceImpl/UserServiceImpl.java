package com.example.pg_spring.service.serviceImpl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.pg_spring.config.JwtUtils;
import com.example.pg_spring.exception.DuplicateUserException;
import com.example.pg_spring.model.LoginDTO;
import com.example.pg_spring.model.User;
import com.example.pg_spring.repository.UserRepo;
import com.example.pg_spring.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepo;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Autowired
    public UserServiceImpl(UserRepo userRepo, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public User createUser(User user) {
        if (userRepo.existsByUsername(user.getUsername())) {
            throw new DuplicateUserException(user.getUsername() + " already exists");
        }
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new DuplicateUserException(user.getEmail() + " already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    @Override
    public LoginDTO loginUser(User user) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

        if (authentication.isAuthenticated()) {
            User newUser = userRepo.findByEmail(user.getEmail());
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", newUser.getUserId());
            claims.put("username", newUser.getUsername());
            return new LoginDTO(jwtUtils.generateToken(newUser.getEmail(), claims));
        }
        throw new BadCredentialsException("Invalid username or password");
    }
}
