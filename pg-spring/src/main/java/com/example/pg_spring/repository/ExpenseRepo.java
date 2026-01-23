package com.example.pg_spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.pg_spring.model.Expense;

@Repository
public interface ExpenseRepo extends JpaRepository<Expense, Integer> {

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE MONTH(e.expenseDate) = :month AND YEAR(e.expenseDate) = :year")
    Double getTotalExpenseForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE YEAR(e.expenseDate) = :year")
    Double getTotalExpenseForYear(@Param("year") int year);
}
