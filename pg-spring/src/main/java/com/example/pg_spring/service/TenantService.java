package com.example.pg_spring.service;

import com.example.pg_spring.model.Tenant;

import java.util.List;

public interface TenantService {
    Tenant addTenant(Tenant tenant);
    List<Tenant> getAllTenants();
    Tenant getTenantById(Integer id);
    Tenant updateTenant(Integer id,Tenant tenant);
    Boolean deleteTenant(Integer id);
}
