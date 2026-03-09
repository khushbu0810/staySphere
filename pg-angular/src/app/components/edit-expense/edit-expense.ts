import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../services/expense-service';

@Component({
  selector: 'app-edit-expense',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-expense.html',
  styleUrl: './edit-expense.css',
})
export class EditExpense implements OnInit {

  constructor(
    private expenseService: ExpenseService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  expenseForm!: FormGroup;
  expenseId!: number;

  // Dropdown values
  categories: string[] = [
    'Electricity',
    'Water',
    'Internet',
    'Maintenance',
    'Cleaning',
    'Grocery',
    'Other'
  ];

  paymentStatuses: string[] = ['Paid', 'UnPaid'];

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      category: ['', Validators.required],
      description: [''],
      amount: ['', [Validators.required, Validators.min(1)]],
      expenseDate: ['', Validators.required],
      expenseMonth: [{ value: '', disabled: true }],
      paymentStatus: ['', Validators.required]
    });

    this.expenseId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.expenseId) {
      this.loadExpense();
    }
  }

  loadExpense() {
    this.expenseService.getExpenseById(this.expenseId).subscribe(data => {
      console.log('Backend status:', data.paymentStatus);

      this.expenseForm.patchValue(data);
    });
  }

  onDateChange() {
    const date = this.expenseForm.get('expenseDate')?.value;
    if (date) {
      const month = new Date(date).toLocaleString('default', { month: 'long' });
      this.expenseForm.patchValue({ expenseMonth: month });
    }
  }

  updateExpense() {
    if (this.expenseForm.valid) {
      this.expenseService
        .updateExpense(this.expenseId, this.expenseForm.getRawValue())
        .subscribe(() => {
          alert('Expense updated successfully');
          this.router.navigate(['/expense-list']);
        });
    }
  }

  get f() {
    return this.expenseForm.controls;
  }
}
