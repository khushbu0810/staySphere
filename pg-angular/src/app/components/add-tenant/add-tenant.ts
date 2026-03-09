import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { TenantService } from '../../services/tenant-service';

@Component({
  selector: 'app-add-tenant',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-tenant.html',
  styleUrl: './add-tenant.css',
})
export class AddTenant implements OnInit {

  tenantForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ts: TenantService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tenantForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      joinDate: ['', Validators.required],
      endDate: [''],
      depositAmount: ['', [Validators.required, Validators.min(0)]],
      occupancyStatus: [{ value: 'ACTIVE', disabled: true }]
    });
  }

  addTenant() {
    if (this.tenantForm.valid) {
      this.ts.addTenant(this.tenantForm.getRawValue()).subscribe({
        next: () => {
          alert('Tenant added successfully');

          // ✅ Reset form but keep default values
          this.tenantForm.reset({
            name: '',
            phoneNumber: '',
            address: '',
            joinDate: '',
            endDate: '',
            depositAmount: '',
            occupancyStatus: 'ACTIVE'
          });
        },
        error: () => {
          alert('Failed to add tenant');
        }
      });
    }
  }


  get f() {
    return this.tenantForm.controls;
  }
}
