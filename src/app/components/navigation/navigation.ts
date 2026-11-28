
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css'
})
export class Navigation {

  auth = inject(AuthService);
  private router = inject(Router);

  isLoggingOut = false;

  logout(): void {

    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;

    this.auth.logout()
      .pipe(
        finalize(() => {
          this.isLoggingOut = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          console.error('Logout request failed:', error);
          this.router.navigateByUrl('/login');
        }
      });
  }

}
