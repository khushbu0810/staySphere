package com.example.pg_spring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.pg_spring.model.Tenant;
import com.example.pg_spring.service.TenantService;

@Controller
@RestController
@RequestMapping("/tenants")
@CrossOrigin(origins = "http://localhost:4200")
public class TenantController {

    TenantService tenantService;

    @Autowired
    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping
    public ResponseEntity<List<Tenant>> getAllTenants() {
        List<Tenant> tenants = tenantService.getAllTenants();
        if (tenants.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(tenants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tenant> getTenantById(@PathVariable Integer id) {
        Tenant tenant = tenantService.getTenantById(id);
        if (tenant == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(tenant);
    }

    @PostMapping
    public ResponseEntity<Tenant> addTenant(@RequestBody Tenant tenant) {
        Tenant newTenant = tenantService.addTenant(tenant);
        if (newTenant == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(newTenant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tenant> updateTenant(@PathVariable Integer id, @RequestBody Tenant tenant) {
        Tenant updatedTenant = tenantService.updateTenant(id, tenant);
        if (updatedTenant == null) {
            return ResponseEntity.status(400).build();
        }
        return ResponseEntity.status(200).body(updatedTenant);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTenant(@PathVariable Integer id) {
        Boolean tenant = tenantService.deleteTenant(id);
        if (tenant) {
            return ResponseEntity.status(200).body("Tenant deleted successfully");
        }
        return ResponseEntity.status(404).body("Tenant Not found");
    }

    @PostMapping("/rent-toggle/{tenantId}")
    public ResponseEntity<Tenant> toggleRent(@PathVariable Integer tenantId) {
        Tenant tenant = tenantService.toggleRentPayment(tenantId);
        if (tenant == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(tenant);
    }

    @GetMapping("/monthly-report/{year}/{month}")
    public ResponseEntity<byte[]> downloadMonthTenantReport(
            @PathVariable int year,
            @PathVariable int month) {

        byte[] report = tenantService.generateMonthTenantReport(year, month);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Tenant_Report_" + year + "_" + month + ".csv")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(report);
    }

    @GetMapping("/yearly-report/{year}")
    public ResponseEntity<byte[]> downloadYearTenantReport(@PathVariable int year) {

        byte[] report = tenantService.generateYearTenantReport(year);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Tenant_Report_" + year + ".csv")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(report);
    }

}
