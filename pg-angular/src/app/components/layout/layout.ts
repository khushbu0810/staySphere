
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-layout',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class LayoutComponent {

  isDashboard = false;
  username: string | null = null;

  constructor(private router: Router, private as: AuthService) {
    // detect current route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isDashboard = event.urlAfterRedirects === '/dashboard';
      });

    // get logged-in username (adjust key if needed)
    this.username = as.getAuthenticatedUsername();
  }


  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
