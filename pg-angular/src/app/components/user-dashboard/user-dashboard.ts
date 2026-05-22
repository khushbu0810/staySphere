import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Tenant } from '../../model/Tenant';
import { TenantService } from '../../services/tenant-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard implements OnInit {

  tenant?: Tenant;

  isLoading = true;

  constructor(
    private ts: TenantService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      const userId = this.auth.getAuthenticatedUserId();
      console.log("Authenticated User ID:", userId);
      if (userId) {
        this.ts.getTenantByUserId(userId).subscribe({
          next: (res) => {
            console.log("Tenant Response:", res);
            this.tenant = res;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.log(err);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        this.isLoading = false;
        console.log("User ID not found");
      }
    }, 100);

  }

  openChat() {
    this.router.navigate(['/tenant-chat']);
  }

}