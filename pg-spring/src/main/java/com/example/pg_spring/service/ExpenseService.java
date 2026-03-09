package com.example.pg_spring.service;

import java.util.List;
import java.util.Map;

import com.example.pg_spring.model.Expense;

public interface ExpenseService {

    Expense addExpense(Expense expense);

    List<Expense> getAllExpenses();

    Expense getExpenseById(Integer id);

    Boolean deleteExpense(Integer id);

    Expense updateExpense(Integer id, Expense expense);

    Map<String, Double> getExpenseSummary();

    Map<String, Double> getProfitLossSummary();

}
