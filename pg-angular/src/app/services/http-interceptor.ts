import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) { }
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = (typeof window !== 'undefined' && window.localStorage)
      ? window.localStorage.getItem('token')
      : null;
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: token.trim() // already contains "Bearer "
        }
      });
    }
    return next.handle(request);
  }

}