import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { inject, runInInjectionContext, Injector } from '@angular/core';
import { from, throwError, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';

export const authInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  injector?: Injector // Accept the injector as the third argument
) => {
  const platformId = inject(PLATFORM_ID);
  let token: string | null = null;
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('access_token');
  }

  // Get AuthService instance using the injector
  const auth = inject(AuthService);
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Bypass MinIO uploads: do not set Authorization header
  if (req.url.includes('minio.phobatdongsan.com.vn')) {
    return next(req);
  }

  // Add Authorization for normal API requests
  return next(req).pipe(
    catchError((err: HttpErrorResponse): Observable<HttpEvent<any>> => {
      if (err.status === 401) {
        console.log('[Interceptor] Token expired. Attempting refresh...');
        if (!auth) {
          console.log('[Interceptor] AuthService not available. Logging out.');
          return throwError(() => err);
        }
        return from(auth.refreshTokenIfNeeded()).pipe(
          switchMap((newToken) => {
            if (!newToken) {
              console.log('[Interceptor] Refresh failed. Logging out.');
              auth.logout$();
              return throwError(() => err);
            }
            console.log('[Interceptor] Refresh success.');
            // Cập nhật token mới đã được set vào localStorage
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
          catchError(() => throwError(() => err))
        );
      }

      return throwError(() => err);
    })
  );
};
