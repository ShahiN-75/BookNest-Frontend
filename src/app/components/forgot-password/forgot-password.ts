
import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: '../../styles/auth.css'
})
export class ForgotPassword {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.form.getRawValue().email
      .trim()
      .toLowerCase();

    this.auth.requestPasswordReset(email)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (response) => {
          this.successMessage = response.message;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.status === 0
            ? 'Unable to connect to the Flask server.'
            : error.error?.message || 'Request failed.';
        }
      });
  }
}
