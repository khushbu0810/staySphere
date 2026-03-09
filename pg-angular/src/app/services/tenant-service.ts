import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Tenant } from '../model/Tenant';
import { globalUrl } from '../../globalUrl';

@Injectable({
  providedIn: 'root',
})
export class TenantService {

  private appUrl = `${globalUrl}/tenants`;

  constructor(private httpClient: HttpClient) { }

  private tenantsSubject = new BehaviorSubject<Tenant[]>([]);
  tenants$ = this.tenantsSubject.asObservable();

  addTenant(tenant: Tenant): Observable<Tenant> {
    return this.httpClient.post<Tenant>(this.appUrl, tenant);
  }

  getAllTenants(): void {
    this.httpClient.get<Tenant[]>(this.appUrl)
      .subscribe(data => this.tenantsSubject.next(data));
  }

  getTenantById(id: number): Observable<Tenant> {
    return this.httpClient.get<Tenant>(`${this.appUrl}/${id}`);
  }

  updateTenant(id: number, tenant: Tenant): Observable<Tenant> {
    return this.httpClient.put<Tenant>(`${this.appUrl}/${id}`, tenant);
  }

  deleteTenant(id: number): Observable<string> {
    return this.httpClient.delete(`${this.appUrl}/${id}`, { responseType: 'text' })
      .pipe(tap(() => this.getAllTenants()));
  }

  toggleRentPayment(tenantId: number): Observable<Tenant> {
    return this.httpClient.post<Tenant>(
      `${this.appUrl}/rent-toggle/${tenantId}`,
      null
    );
  }

  // 🔹 YEAR-WISE
  downloadYearlyReport(year: number): Observable<Blob> {
    return this.httpClient.get(
      `${this.appUrl}/yearly-report/${year}`,
      { responseType: 'blob' }
    );
  }

  // 🔹 MONTH-WISE
  downloadMonthlyReport(year: number, month: number): Observable<Blob> {
    return this.httpClient.get(
      `${this.appUrl}/monthly-report/${year}/${month}`,
      { responseType: 'blob' }
    );
  }

}
