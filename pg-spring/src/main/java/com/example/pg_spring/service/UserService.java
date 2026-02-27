package com.example.pg_spring.service;

import com.example.pg_spring.model.LoginDTO;
import com.example.pg_spring.model.User;

public interface UserService {

    User createUser(User user);

    LoginDTO loginUser(User user);
}
