
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginModel } from '../../model/Login';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  @ViewChild('loginForm') loginForm!: NgForm;

  loginInfo: LoginModel = { email: '', password: '' };
  errorMessage = '';


  constructor(private authService: AuthService, private readonly router: Router) { }

  login() {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.authService.login(this.loginInfo).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = "Invalid credentials.";
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      },

    });
  }

}
