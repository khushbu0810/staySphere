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
  selectedProfileImage!: File;
  selectedPdf!: File;
  maxFileSize = 5 * 1024 * 1024; // 5 MB
  pgImages: string[] = [];
  showPgImages = false;

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
            this.loadPgImages();
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

  loadPgImages() {
    this.ts.getPgImages().subscribe({
      next: (res) => {
        this.pgImages = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  togglePgImages() {

    this.showPgImages =
      !this.showPgImages;
  }

  lightboxImage: string | null = null;

  openLightbox(url: string) {
    this.lightboxImage = url;
  }

  openChat() {
    this.router.navigate(['/tenant-chat']);
  }

  onProfileImageChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    // Image validation
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed.');
      return;
    }
    // Size validation
    if (file.size > this.maxFileSize) {
      alert('Profile image size must be less than 5 MB.');
      return;
    }
    this.selectedProfileImage = file;
  }

  onPdfChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    // PDF validation
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }
    // Size validation
    if (file.size > this.maxFileSize) {
      alert('PDF size must be less than 5 MB.');
      return;
    }
    this.selectedPdf = file;
  }



  uploadProfileImage() {
    if (!this.tenant?.id || !this.selectedProfileImage) {
      alert('Please select an image.');
      return;
    }
    this.ts.uploadProfileImage(
      this.tenant.id,
      this.selectedProfileImage

    ).subscribe({
      next: () => {
        alert('Profile image uploaded');
        this.ts.getTenantByUserId(
          this.auth.getAuthenticatedUserId()!
        ).subscribe(res => {
          this.tenant = res;
        });
      },
      error: (err) => {
        console.log(err);
        if (err.error) {
          alert(err.error);
        } else {
          alert('Failed to upload profile image');
        }
      }
    });
  }

  uploadIdentityProof() {
    if (!this.tenant?.id || !this.selectedPdf) {
      alert('Please select a PDF.');
      return;
    }
    this.ts.uploadIdentityProof(
      this.tenant.id,
      this.selectedPdf

    ).subscribe({
      next: () => {
        alert('Identity proof uploaded');
        this.ts.getTenantByUserId(
          this.auth.getAuthenticatedUserId()!
        ).subscribe(res => {
          this.tenant = res;
        });
      },
      error: (err) => {
        console.log(err);
        if (err.error) {
          alert(err.error);
        } else {
          alert('Failed to upload PDF');
        }
      }
    });
  }

}