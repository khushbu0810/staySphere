import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantService } from '../../services/tenant-service';

@Component({
  selector: 'app-edit-tenant',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-tenant.html',
  styleUrl: './edit-tenant.css',
})
export class EditTenant implements OnInit {

  tenantForm!: FormGroup;
  tenantId!: number;

  constructor(
    private fb: FormBuilder,
    private ts: TenantService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tenantForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      joinDate: [{ value: '', disabled: true }],
      endDate: [''],
      depositAmount: ['', [Validators.required, Validators.min(0)]],
      occupancyStatus: [{ value: '', disabled: true }]
    });

    this.tenantId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.tenantId) {
      this.loadTenant();
    }
  }

  loadTenant() {
    this.ts.getTenantById(this.tenantId).subscribe(tenant => {
      this.tenantForm.patchValue(tenant);
    });
  }

  updateTenant() {
    if (this.tenantForm.invalid) return;

    const updatedTenant = this.tenantForm.getRawValue();

    this.ts.updateTenant(this.tenantId, updatedTenant).subscribe(() => {
      alert('Tenant updated successfully');
      this.router.navigate(['/tenant-list']);
    });
  }

  get f() {
    return this.tenantForm.controls;
  }
}
