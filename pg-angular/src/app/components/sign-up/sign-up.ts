
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../model/User';
import { AuthService } from '../../services/auth-service';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
declare const google: any;

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp implements OnInit {

  successMessage = '';
  errorMessage = '';
  confirmPassword = '';
  selectedGoogleRole = 'USER';

  user: User = {
    username: '',
    email: '',
    password: '',
    accountStatus: true,
    role: 'USER'
  };

  isStayingInPg = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleScript();
    }

  }

  handleGoogleLogin(response: any) {
    const decoded: any = jwtDecode(response.credential);
    const googleUser = {
      email: decoded.email,
      username: decoded.name,
      role: this.selectedGoogleRole
    };
    this.authService.googleLogin(googleUser).subscribe({
      next: () => {
        const role = this.authService.getAuthenticatedUserRole();
        if (role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (err) => {
        console.log('GOOGLE LOGIN ERROR:', err);
        console.log('STATUS:', err.status);
        console.log('BODY:', err.error);
        this.errorMessage = 'Google sign in failed';
      }
    });
  }

  loadGoogleScript() {
    if (typeof google !== 'undefined') {
      this.initializeGoogle();
      return;
    }
    if (typeof window === 'undefined') return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeGoogle();
    };
    document.head.appendChild(script);
  }

  initializeGoogle() {
    google.accounts.id.initialize({
      client_id:
        '847182070163-0mtp8v7odh6f56on95l61r7pkv2l4gf5.apps.googleusercontent.com',
      callback: (response: any) => this.handleGoogleLogin(response),
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: false
    });

    google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'pill',
        text: 'continue_with',
        width: 980,
        logo_alignment: 'left',
      }
    );
  }
  register(form: NgForm) {

    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      this.errorMessage = 'All fields are required.';
      return;
    }

    // Only check password match (NO regex)
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.isStayingInPg) {
      this.user.role = 'USER';
    } else {
      this.user.role = 'ADMIN';
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        this.errorMessage = '';
        this.successMessage = 'Registration successful! Redirecting to login...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }
}
