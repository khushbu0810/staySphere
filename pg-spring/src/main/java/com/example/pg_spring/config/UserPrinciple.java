package com.example.pg_spring.config;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.pg_spring.model.User;

import lombok.Getter;

public class UserPrinciple implements UserDetails {

    private final String username;
    @Getter
    private final int id; // <-- add this
    private final String password;
    private final boolean accountStatus;

    public UserPrinciple(User user) {
        username = user.getEmail();
        password = user.getPassword();
        accountStatus = user.getAccountStatus();
        this.id = user.getUserId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        if (!accountStatus) {
            throw new LockedException("Account is locked");
        }
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
