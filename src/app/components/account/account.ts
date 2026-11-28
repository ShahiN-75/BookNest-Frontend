
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import {
  AuthService,
  ProfileResponse
} from '../../services/auth';

@Component({
  selector: 'app-account',
  imports: [RouterLink],
  templateUrl: './account.html',
  styleUrl: '../../styles/auth.css'
})
export class Account implements OnInit {

  private auth = inject(AuthService);
  private router = inject(Router);

  profile: ProfileResponse | null = null;
  errorMessage = '';
  isLoading = true;
  isLoggingOut = false;

  ngOnInit(): void {

    this.auth.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to load your profile.';

        this.isLoading = false;

        if (error.status === 401) {
          this.auth.clearLocalSession();
          this.router.navigateByUrl('/login');
        }
      }
    });
  }

  logout(): void {

    this.isLoggingOut = true;

    this.auth.logout()
      .pipe(finalize(() => this.isLoggingOut = false))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/login');
        },
        error: () => {
          this.router.navigateByUrl('/login');
        }
      });
  }

}
