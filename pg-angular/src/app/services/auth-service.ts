import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../model/User';
import { globalUrl } from '../../globalUrl';
import { LoginModel } from '../model/Login';

export const TOKEN = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private readonly http: HttpClient) { }

  private appUrl = `${globalUrl}`;

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.appUrl}/register`, user);
  }

  login(login: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.appUrl}/login`, login).pipe(
      map(
        data => {
          if (this.isBrowser()) {
            localStorage.setItem(TOKEN, `Bearer ${data.token}`);
            return data;
          }
        }
      )
    );
  }

  getAuthenticatedToken(): string | null {
    if (!this.isBrowser()) return null;
    const tokenWithBearer = localStorage.getItem(TOKEN);
    return tokenWithBearer ? tokenWithBearer.replace('Bearer ', '') : null;
  }

  getDecodedToken(): any {
    const token = this.getAuthenticatedToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    if (!payload) return null;

    try {
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  getAuthenticatedUserId(): number | null {
    return this.getDecodedToken()?.userId ?? null;
  }

  getAuthenticatedUsername(): string | null {
    return this.getDecodedToken()?.sub ?? null;
  }

  getAuthenticatedUserRole(): string | null {
    return this.getDecodedToken()?.role ?? null;
  }

  getAuthenticatedUserEmail(): string | null {
    return this.getDecodedToken()?.sub ?? null;
  }

  isTokenExpired(): boolean {
    const exp = this.getDecodedToken()?.exp;
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  }

  isLoggedin(): boolean {
    let username = this.getAuthenticatedUsername();
    return username != null;
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.clear();
    }
  }


  isAdmin(): boolean {
    return this.getAuthenticatedUserRole() === 'Admin';
  }


  isUser(): boolean {
    return this.getAuthenticatedUserRole() === 'User';
  }

}

