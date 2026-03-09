import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  canActivate(): boolean {

    // Token expired
    if (this.authService.isTokenExpired()) {
      if (this.isBrowser()) {
        localStorage.clear();
      }
      this.router.navigate(['/login']);
      return false;
    }

    // Not logged in
    if (!this.authService.isLoggedin()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Logged in → allow access
    return true;
  }
}
