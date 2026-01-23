package com.example.pg_spring.controller;

import java.util.List;
import java.util.Map;

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

import com.example.pg_spring.model.Expense;
import com.example.pg_spring.service.ExpenseService;

@Controller
@RestController
@RequestMapping("/expense")
@CrossOrigin(origins = "http://localhost:4200")
public class ExpenseController {

    ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense) {
        Expense exp = expenseService.addExpense(expense);
        if (exp == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(exp);
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpense() {
        List<Expense> exp = expenseService.getAllExpenses();
        if (exp == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(exp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Integer id) {
        Expense exp = expenseService.getExpenseById(id);
        if (exp == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(exp);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Integer id, @RequestBody Expense expense) {
        Expense exp = expenseService.updateExpense(id, expense);
        if (exp == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(exp);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Integer id) {
        Boolean exp = expenseService.deleteExpense(id);
        if (exp) {
            return ResponseEntity.status(200).body("Expense deleted successfully");
        }
        return ResponseEntity.status(404).body("Expense Not found");
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Double>> getExpenseSummary() {
        return ResponseEntity.status(200).body(expenseService.getExpenseSummary());
    }

    @GetMapping("/profitLoss")
    public ResponseEntity<Map<String, Double>> getProfitLoss() {
        return ResponseEntity.status(200).body(expenseService.getProfitLossSummary());
    }

}
