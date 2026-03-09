
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../model/User';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {

  successMessage = '';
  errorMessage = '';
  confirmPassword = '';

  user: User = {
    username: '',
    email: '',
    password: '',
    accountStatus: true
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

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
