package com.example.pg_spring.service.serviceImpl;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.pg_spring.model.Expense;
import com.example.pg_spring.repository.ExpenseRepo;
import com.example.pg_spring.repository.TenantRepo;
import com.example.pg_spring.service.ExpenseService;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    ExpenseRepo expenseRepo;
    TenantRepo tenantRepo;

    public ExpenseServiceImpl(ExpenseRepo expenseRepo, TenantRepo tenantRepo) {
        this.expenseRepo = expenseRepo;
        this.tenantRepo = tenantRepo;
    }

    @Override
    public Expense addExpense(Expense expense) {
        return expenseRepo.save(expense);
    }

    @Override
    public List<Expense> getAllExpenses() {
        return expenseRepo.findAll();
    }

    @Override
    public Expense getExpenseById(Integer id) {
        Optional<Expense> optExpense = expenseRepo.findById(id);
        if (optExpense.isEmpty()) {
            return null;
        }
        return optExpense.get();
    }

    @Override
    public Boolean deleteExpense(Integer id) {
        Optional<Expense> optExpense = expenseRepo.findById(id);
        if (optExpense.isEmpty()) {
            return false;
        }
        Expense exp = optExpense.get();
        expenseRepo.delete(exp);
        return true;
    }

    @Override
    public Expense updateExpense(Integer id, Expense expense) {
        Optional<Expense> optExpense = expenseRepo.findById(id);
        if (optExpense.isPresent()) {
            Expense updExpense = optExpense.get();
            updExpense.setAmount(expense.getAmount());
            updExpense.setCategory(expense.getCategory());
            updExpense.setDescription(expense.getCategory());
            updExpense.setExpenseDate(expense.getExpenseDate());
            updExpense.setExpenseMonth(expense.getExpenseMonth());
            updExpense.setPaymentStatus(expense.getPaymentStatus());
            return expenseRepo.save(updExpense);
        }
        return null;
    }

    @Override
    public Map<String, Double> getExpenseSummary() {

        LocalDate today = LocalDate.now();
        int month = today.getMonthValue();
        int year = today.getYear();

        Double monthlyTotal = expenseRepo.getTotalExpenseForMonth(month, year);
        Double yearlyTotal = expenseRepo.getTotalExpenseForYear(year);

        Map<String, Double> summary = new HashMap<>();
        summary.put("totalExpenseThisMonth", monthlyTotal);
        summary.put("totalExpenseThisYear", yearlyTotal);

        return summary;
    }

    @Override
    public Map<String, Double> getProfitLossSummary() {

        LocalDate today = LocalDate.now();
        int month = today.getMonthValue();
        int year = today.getYear();

        // 🔹 Income
        Double rentMonth = tenantRepo.rentThisMonth();
        Double rentYear = tenantRepo.rentThisYear();

        Double depositMonth = tenantRepo.depositThisMonth(month, year);
        Double depositYear = tenantRepo.depositThisYear(year);

        Double incomeMonth = rentMonth + depositMonth;
        Double incomeYear = rentYear + depositYear;

        // 🔹 Expenses
        Double expenseMonth = expenseRepo.getTotalExpenseForMonth(month, year);
        Double expenseYear = expenseRepo.getTotalExpenseForYear(year);

        // 🔹 Profit / Loss
        Map<String, Double> map = new HashMap<>();

        map.put("incomeThisMonth", incomeMonth);
        map.put("incomeThisYear", incomeYear);

        map.put("rentThisMonth", rentMonth);
        map.put("rentThisYear", rentYear);

        map.put("depositThisMonth", depositMonth);
        map.put("depositThisYear", depositYear);

        map.put("expenseThisMonth", expenseMonth);
        map.put("expenseThisYear", expenseYear);

        map.put("profitLossThisMonth", incomeMonth - expenseMonth);
        map.put("profitLossThisYear", incomeYear - expenseYear);

        return map;
    }

}
