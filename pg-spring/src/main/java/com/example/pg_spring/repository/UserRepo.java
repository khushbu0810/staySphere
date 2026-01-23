package com.example.pg_spring.repository;

import com.example.pg_spring.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Integer> {
}
