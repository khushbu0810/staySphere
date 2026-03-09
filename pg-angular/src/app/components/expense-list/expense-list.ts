import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { ExpenseService } from '../../services/expense-service';
import { Expense } from '../../model/Expense';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList implements OnInit {

  expenses$!: Observable<Expense[]>;

  // grouped by category
  categories$!: Observable<{ category: string; expenses: Expense[] }[]>;

  showModal = false;
  selectedCategory: string | null = null;
  selectedExpenses: Expense[] = [];

  constructor(
    private es: ExpenseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 🔥 Load once
    this.es.getAllExpenses();

    // 🔥 Shared observable (same as Room)
    this.expenses$ = this.es.expenses$;

    // 🔥 Group expenses by category
    this.categories$ = this.expenses$.pipe(
      map(expenses => {
        const mapObj = new Map<string, Expense[]>();

        expenses.forEach(exp => {
          if (!mapObj.has(exp.category)) {
            mapObj.set(exp.category, []);
          }
          mapObj.get(exp.category)!.push(exp);
        });

        return Array.from(mapObj.entries()).map(([category, expenses]) => ({
          category,
          expenses
        }));
      })
    );
  }

  openCategory(category: string, expenses: Expense[]) {
    this.selectedCategory = category;
    this.selectedExpenses = expenses;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedCategory = null;
    this.selectedExpenses = [];
  }

  onEdit(expenseId: number) {
    this.closeModal();
    this.router.navigate(['/edit-expense', expenseId]);
  }

  onDelete(expenseId: number) {
    this.es.deleteExpense(expenseId).subscribe(() => {
      alert('Expense deleted successfully');

      // 🔥 update modal immediately
      this.selectedExpenses = this.selectedExpenses.filter(
        e => e.id !== expenseId
      );

      // 🔥 close modal if empty
      if (this.selectedExpenses.length === 0) {
        this.closeModal();
      }
    });
  }
}
