
import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: '../../styles/auth.css'
})
export class ResetPassword {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  token = this.route.snapshot.queryParamMap.get('token') || '';

  form = this.fb.nonNullable.group({
    password: ['', [
      Validators.required,
      Validators.minLength(8)
    ]],
    confirmPassword: ['', Validators.required]
  });

  isSubmitting = false;
  isSuccess = false;
  errorMessage = '';

  submit(): void {

    if (!this.token) {
      this.errorMessage = 'The reset link is invalid.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } =
      this.form.getRawValue();

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (new TextEncoder().encode(password).length > 72) {
      this.errorMessage = 'Password is too long.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.auth.resetPassword(this.token, password)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.isSuccess = true;
          this.form.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.status === 0
            ? 'Unable to connect to the Flask server.'
            : error.error?.message || 'Password reset failed.';
        }
      });
  }

}
