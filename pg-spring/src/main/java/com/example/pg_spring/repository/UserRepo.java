package com.example.pg_spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.pg_spring.model.User;

public interface UserRepo extends JpaRepository<User, Integer> {

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    User findByEmail(String email);

}
