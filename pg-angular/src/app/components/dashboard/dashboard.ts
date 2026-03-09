
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room-service';
import { ExpenseService } from '../../services/expense-service';
import { Chart } from 'chart.js';
import { TenantService } from '../../services/tenant-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  constructor(
    private router: Router,
    private rs: RoomService,
    private ts: TenantService,
    private es: ExpenseService,
    private cdr: ChangeDetectorRef
  ) { }

  // PG summary
  totalStaying = 0;
  totalVacancy = 0;

  // Expense summary
  totalExpenseThisMonth = 0;
  totalExpenseThisYear = 0;

  // income
  incomeThisMonth = 0;
  incomeThisYear = 0;
  profitLossThisMonth = 0;
  profitLossThisYear = 0;


  // 🔹 Dropdown values
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;

  years: number[] = [2026, 2027, 2028, 2029, 2030];

  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];



  ngOnInit(): void {

    // 🔹 PG Summary
    this.rs.getPgSummary().subscribe(res => {
      this.totalStaying = res.totalStaying;
      this.totalVacancy = res.totalVacancy;
      this.cdr.detectChanges();
    });

    // 🔹 Expense Summary
    this.es.getExpenseSummary().subscribe(res => {
      this.totalExpenseThisMonth = res.totalExpenseThisMonth;
      this.totalExpenseThisYear = res.totalExpenseThisYear;
      this.cdr.detectChanges();
    });

    // 🔹 PROFIT / LOSS SUMMARY 
    this.es.getProfitLossSummary().subscribe(res => {
      this.incomeThisMonth = res.incomeThisMonth;
      this.incomeThisYear = res.incomeThisYear;

      this.profitLossThisMonth = res.profitLossThisMonth;
      this.profitLossThisYear = res.profitLossThisYear;

      this.cdr.detectChanges();
    });
  }


  // 🔥 YEAR DOWNLOAD
  downloadYearly() {
    this.ts.downloadYearlyReport(this.selectedYear)
      .subscribe(blob => this.download(blob, `Tenant_Report_${this.selectedYear}.csv`));
  }

  // 🔥 MONTH DOWNLOAD
  downloadMonthly() {
    this.ts.downloadMonthlyReport(this.selectedYear, this.selectedMonth)
      .subscribe(blob =>
        this.download(blob, `Tenant_Report_${this.selectedYear}_${this.selectedMonth}.csv`)
      );
  }

  private download(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }


  addTenant() {
    this.router.navigate(['/add-tenant']);
  }
  addRoom() {
    this.router.navigate(['/add-room']);
  }
  addExpense() {
    this.router.navigate(['/add-expense']);
  }
  tenantList() {
    this.router.navigate(['/tenant-list']);
  }
  roomList() {
    this.router.navigate(['/room-list']);
  }
  expenseList() {
    this.router.navigate(['/expense-list']);
  }
}
