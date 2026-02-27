package com.example.pg_spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.pg_spring.model.Tenant;

public interface TenantRepo extends JpaRepository<Tenant, Integer> {

    // 🔹 Rent this month (all living tenants)
    @Query("""
SELECT COALESCE(SUM(r.rentAmount), 0)
FROM Tenant t
JOIN t.room r
WHERE t.occupancyStatus = 'Living'
AND t.rentPaid = true
AND MONTH(t.joinDate) = MONTH(CURRENT_DATE)
AND YEAR(t.joinDate) = YEAR(CURRENT_DATE)
""")
    Double rentThisMonth();

    // 🔹 Rent this year (12 months assumption)
    @Query("""
SELECT COALESCE(SUM(r.rentAmount), 0)
FROM Tenant t
JOIN t.room r
WHERE t.occupancyStatus = 'Living'
AND t.rentPaid = true
AND YEAR(t.joinDate) = YEAR(CURRENT_DATE)
""")
    Double rentThisYear();

    // 🔹 Deposit collected this month
    @Query("""
    SELECT COALESCE(SUM(t.depositAmount), 0)
    FROM Tenant t
    WHERE MONTH(t.joinDate) = :month
    AND YEAR(t.joinDate) = :year
    """)
    Double depositThisMonth(@Param("month") int month,
            @Param("year") int year);

    // 🔹 Deposit collected this year
    @Query("""
    SELECT COALESCE(SUM(t.depositAmount), 0)
    FROM Tenant t
    WHERE YEAR(t.joinDate) = :year
    """)
    Double depositThisYear(@Param("year") int year);
}
