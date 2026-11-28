
import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../../styles/auth.css'
})
export class Register {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    first_name: ['', [
      Validators.required,
      Validators.maxLength(100)
    ]],
    last_name: ['', [
      Validators.required,
      Validators.maxLength(100)
    ]],
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(8)
    ]],
    confirmPassword: ['', Validators.required]
  });

  errorMessage = '';
  isSubmitting = false;

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {
      first_name,
      last_name,
      email,
      password,
      confirmPassword
    } = this.form.getRawValue();

    if (!first_name.trim() || !last_name.trim()) {
      this.errorMessage = 'First name and last name are required.';
      return;
    }

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

    this.auth.register({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
      password
    })
    .pipe(finalize(() => this.isSubmitting = false))
    .subscribe({
      next: () => {
        this.router.navigate(['/login'], {
          queryParams: { registered: '1' }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.status === 0
          ? 'Cannot connect to BookNest API. Check Flask and CORS.'
          : error.error?.message ||
            'Registration failed. Please try again.';
      }
    });
  }

}
