import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Tenant } from '../../model/Tenant';
import { TenantService } from '../../services/tenant-service';
import { RoomService } from '../../services/room-service';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.css',
})
export class TenantList implements OnInit {

  tenants$!: Observable<Tenant[]>;
  activeTenants$!: Observable<Tenant[]>;
  pastTenants$!: Observable<Tenant[]>;

  paidTenants$!: Observable<Tenant[]>;
  unpaidTenants$!: Observable<Tenant[]>;

  // 🔹 ADDED: search & rent filter state
  search$ = new BehaviorSubject<string>('');
  rentFilter$ = new BehaviorSubject<'ALL' | 'PAID' | 'UNPAID'>('ALL');

  constructor(
    private ts: TenantService,
    private rs: RoomService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Load tenants once
    this.ts.getAllTenants();

    // Shared observable
    this.tenants$ = this.ts.tenants$;

    // ✅ Active tenants WITH FILTER (existing logic preserved)
    this.activeTenants$ = combineLatest([
      this.tenants$,
      this.search$,
      this.rentFilter$
    ]).pipe(
      map(([tenants, search, rentFilter]) =>
        tenants
          .filter(t => t.occupancyStatus !== 'Vacated')
          .filter(t => {
            const term = search.toLowerCase();
            const nameMatch = t.name?.toLowerCase().includes(term);
            const roomMatch = t.room?.roomNumber?.toString().includes(term);
            return nameMatch || roomMatch;
          })
          .filter(t => {
            if (rentFilter === 'PAID') return t.rentPaid === true;
            if (rentFilter === 'UNPAID') return t.rentPaid !== true;
            return true;
          })
      )
    );

    // 🔹 Paid tenants (unchanged)
    this.paidTenants$ = this.tenants$.pipe(
      map(t => t.filter(x =>
        x.occupancyStatus === 'Living' && x.rentPaid === true
      ))
    );

    // 🔹 Unpaid tenants (unchanged)
    this.unpaidTenants$ = this.tenants$.pipe(
      map(t => t.filter(x =>
        x.occupancyStatus === 'Living' && x.rentPaid !== true
      ))
    );

    // 🔹 Past tenants (unchanged)
    this.pastTenants$ = this.tenants$.pipe(
      map(t => t.filter(x => x.occupancyStatus === 'Vacated'))
    );
  }

  // 🔹 ADDED: filter handlers
  onSearchChange(value: string) {
    this.search$.next(value);
  }

  onRentFilterChange(value: string) {
    this.rentFilter$.next(value as 'ALL' | 'PAID' | 'UNPAID');
  }


  toggleRent(tenantId: number) {
    this.ts.toggleRentPayment(tenantId).subscribe(() => {
      this.ts.getAllTenants();
    });
  }

  onEdit(tenantId: number) {
    this.router.navigate(['/edit-tenant', tenantId]);
  }

  onAssign(tenantId: number) {
    this.router.navigate(['/assign-room', tenantId]);
  }

  onVacate(tenantId: number) {
    this.rs.vacateRoomFromTenant(tenantId).subscribe(() => {
      alert('Tenant vacated successfully');
      this.ts.getAllTenants();
    });
  }

  onDelete(tenantId: number) {
    this.ts.deleteTenant(tenantId).subscribe(() => {
      alert('Tenant deleted successfully');
    });
  }
}
