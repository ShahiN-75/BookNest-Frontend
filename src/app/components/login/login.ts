
import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: '../../styles/auth.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  registered =
    this.route.snapshot.queryParamMap.get('registered') === '1';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  errorMessage = '';
  isSubmitting = false;

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/account');
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.status === 0
            ? 'Cannot connect to BookNest API. Check Flask and CORS.'
            : error.error?.message || 'Login failed. Please try again.';
        }
      });
  }

}
