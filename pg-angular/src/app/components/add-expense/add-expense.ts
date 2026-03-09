import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService } from '../../services/expense-service';
import { Expense } from '../../model/Expense';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css',
})
export class AddExpense implements OnInit {

  constructor(
    private es: ExpenseService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  expenseForm!: FormGroup;

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      category: ['', Validators.required],
      description: [''],
      amount: ['', [Validators.required, Validators.min(1)]],
      expenseDate: ['', Validators.required],
      expenseMonth: [{ value: '', disabled: true }],
      paymentStatus: ['Paid', Validators.required]
    });
  }

  paymentStatuses: string[] = ['Paid', 'UnPaid'];

  categories: string[] = [
    'Electricity',
    'Water',
    'Internet',
    'Maintenance',
    'Cleaning',
    'Kitchen',
    'Other'
  ];

  addExpense() {
    if (this.expenseForm.valid) {
      this.es.addExpense(this.expenseForm.getRawValue()).subscribe({
        next: () => {
          alert('Expense added successfully');

          // ✅ Reset form with defaults
          this.expenseForm.reset({
            category: '',
            description: '',
            amount: '',
            expenseDate: '',
            expenseMonth: '',
            paymentStatus: 'Paid'
          });
        },
        error: () => {
          alert('Failed to add expense');
        }
      });
    }
  }


  onDateChange() {
    const date = this.expenseForm.get('expenseDate')?.value;

    if (date) {
      const month = new Date(date).toLocaleString('default', { month: 'long' });

      this.expenseForm.patchValue({
        expenseMonth: month
      });
    }
  }

  get f() {
    return this.expenseForm.controls;
  }
}
