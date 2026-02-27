package com.example.pg_spring.service;

import java.util.List;

import com.example.pg_spring.model.Tenant;

public interface TenantService {

    Tenant addTenant(Tenant tenant);

    List<Tenant> getAllTenants();

    Tenant getTenantById(Integer id);

    Tenant updateTenant(Integer id, Tenant tenant);

    Boolean deleteTenant(Integer id);

    Tenant toggleRentPayment(Integer tenantId);

    byte[] generateMonthTenantReport(int year, int month);

    byte[] generateYearTenantReport(int year);

}
