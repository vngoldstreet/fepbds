import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { setUser } from '../../core/stores/user.store';
import { tap, map, catchError, of, Observable } from 'rxjs';
import { environment } from '../../enviroments';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  login$(email: string, password: string) {
    const loginUrl = `${environment.API_BASE}/${environment.LOGIN}`;
    return this.http
      .post<any>(loginUrl, { email: email, password: password })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('refresh_token', res.data.refresh_token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          setUser(res.user);
        })
      );
  }

  resetPassword$(email: string) {
    const loginUrl = `${environment.API_BASE}/${environment.RESET_PASSWORD}?email=${email}`;
    return this.http.post<any>(loginUrl, {}).pipe(
      tap((res) => {
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.user);
      })
    );
  }

  confirmResetPassword$(token: string) {
    const loginUrl = `${environment.API_BASE}/${environment.CONFIRM_RESET_PASSWORD}?token=${token}`;
    return this.http.post<any>(loginUrl, {}).pipe(tap((res) => {}));
  }

  register$(data: any) {
    const loginUrl = `${environment.API_BASE}/${environment.REGISTER}`;
    return this.http.post<any>(loginUrl, data).pipe(tap((res) => {}));
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  restoreSession() {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');

    if (userStr && userStr !== 'undefined' && token) {
      try {
        const user = JSON.parse(userStr);
        setUser(user);
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        // Xử lý fallback nếu cần: clear localStorage?
        localStorage.removeItem('user');
      }
    }
  }

  logout$() {
    localStorage.clear();
    setUser(null);
    this.router.navigate(['/dang-nhap']);
  }

  refreshTokenIfNeeded(): Observable<string | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    // console.log('[AuthService] Refresh token attempt', refreshToken);
    if (!refreshToken) {
      return of(null);
    }
    const refreshEndpoint = `${environment.API_BASE}/${environment.REFRESH_TOKEN}`;

    return this.http
      .post<any>(refreshEndpoint, { refresh_token: refreshToken })
      .pipe(
        tap((res) => {
          // console.log('[AuthService] Refresh success:', res);
          localStorage.setItem('access_token', res.access_token);
        }),
        map((res) => res.access_token),
        catchError((err) => {
          console.error('[AuthService] Refresh failed:', err);
          this.logout$();
          return of(null);
        })
      );
  }
}
