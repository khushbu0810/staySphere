import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Expense } from '../model/Expense';
import { globalUrl } from '../../globalUrl';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {

  constructor(private httpClient: HttpClient) { }

  private appUrl = `${globalUrl}/expense`;

  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expensesSubject.asObservable();

  addExpense(expense: Expense): Observable<Expense> {
    return this.httpClient.post<Expense>(this.appUrl, expense);
  }

  getAllExpenses(): void {
    this.httpClient.get<Expense[]>(this.appUrl)
      .subscribe(data => this.expensesSubject.next(data));
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.httpClient.get<Expense>(`${this.appUrl}/${id}`);
  }

  updateExpense(id: number, expense: Expense): Observable<Expense> {
    return this.httpClient.put<Expense>(`${this.appUrl}/${id}`, expense)
      .pipe(tap(() => this.getAllExpenses()));
  }

  deleteExpense(id: number): Observable<string> {
    return this.httpClient.delete(`${this.appUrl}/${id}`, { responseType: 'text' })
      .pipe(tap(() => this.getAllExpenses()));
  }

  getExpenseSummary(): Observable<any> {
    return this.httpClient.get<any>(`${this.appUrl}/summary`);
  }
  getProfitLossSummary(): Observable<any> {
    return this.httpClient.get<any>(`${this.appUrl}/profitLoss`);
  }
}
