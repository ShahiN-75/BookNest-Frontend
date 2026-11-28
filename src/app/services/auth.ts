
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, finalize, of, tap } from 'rxjs';

export interface AuthUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
  user: AuthUser;
}

interface LoginResponse {
  message: string;
  token: string;
  token_type: string;
  expires_in_minutes: number;
  user: AuthUser;
}

export interface ProfileResponse {
  user_id: number;
  profile: {
    personal_details: {
      first_name: string;
      last_name: string;
    };
    contact: {
      email: string;
      phone: string | null;
    };
  };
  account: {
    role: string;
    registered: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:5000/api/v1.0';

  private tokenKey = 'booknest_access_token';
  private expiryKey = 'booknest_token_expiry';
  private userKey = 'booknest_current_user';

  currentUser = signal<AuthUser | null>(this.restoreUser());

  // Register a new customer
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      data
    );
  }

  // Login using HTTP Basic Authentication
  login(email: string, password: string): Observable<LoginResponse> {

    const credentials = `${email.trim()}:${password}`;

    const encoded = btoa(
      Array.from(
        new TextEncoder().encode(credentials),
        byte => String.fromCharCode(byte)
      ).join('')
    );

    const headers = new HttpHeaders({
      Authorization: `Basic ${encoded}`
    });

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      null,
      { headers }
    ).pipe(
      tap(response => {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(this.tokenKey, response.token);

          sessionStorage.setItem(
            this.expiryKey,
            String(Date.now() + response.expires_in_minutes * 60000)
          );

          sessionStorage.setItem(
            this.userKey,
            JSON.stringify(response.user)
          );
        }

        this.currentUser.set(response.user);
      })
    );
  }

  // Retrieve the JWT if it has not expired
  getToken(): string | null {

    if (typeof sessionStorage === 'undefined') {
      return null;
    }

    const token = sessionStorage.getItem(this.tokenKey);

    const expiresAt = Number(
      sessionStorage.getItem(this.expiryKey) || '0'
    );

    if (!token || Date.now() >= expiresAt) {
      this.clearLocalSession();
      return null;
    }

    return token;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Read the authenticated user's profile
  getProfile(): Observable<ProfileResponse> {

    const headers = new HttpHeaders({
      'x-access-token': this.getToken() || ''
    });

    return this.http.get<ProfileResponse>(
      `${this.apiUrl}/users/me`,
      { headers }
    );
  }

  // Logout and revoke the JWT in Flask
  logout(): Observable<{ message: string } | null> {

    const token = this.getToken();

    if (!token) {
      this.clearLocalSession();
      return of(null);
    }

    const headers = new HttpHeaders({
      'x-access-token': token
    });

    return this.http.post<{ message: string }>(
      `${this.apiUrl}/logout`,
      {},
      { headers }
    ).pipe(
      finalize(() => this.clearLocalSession())
    );
  }

  clearLocalSession(): void {

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem(this.expiryKey);
      sessionStorage.removeItem(this.userKey);
    }

    this.currentUser.set(null);
  }

  private restoreUser(): AuthUser | null {

    if (typeof sessionStorage === 'undefined') {
      return null;
    }

    const token = sessionStorage.getItem(this.tokenKey);

    const expiresAt = Number(
      sessionStorage.getItem(this.expiryKey) || '0'
    );

    if (!token || Date.now() >= expiresAt) {
      sessionStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem(this.expiryKey);
      sessionStorage.removeItem(this.userKey);
      return null;
    }

    try {
      const storedUser = sessionStorage.getItem(this.userKey);

      return storedUser
        ? JSON.parse(storedUser) as AuthUser
        : null;

    } catch {
      return null;
    }
  }

// Request a password-reset email
requestPasswordReset(email: string): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(
    `${this.apiUrl}/forgot-password`,
    { email }
  );
}

// Set a new password using the reset token
resetPassword(
  token: string,
  password: string
): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(
    `${this.apiUrl}/reset-password`,
    { token, password }
  );
}

}
