import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // attach content-type + bearer token to every request
  const authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      ...(tokenService.getAccessToken() && {
        Authorization: `Bearer ${tokenService.getAccessToken()}`,
      }),
    },
  });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401) return throwError(() => err);

      // token expired — call refresh
      return tokenService.refreshAccessToken().pipe(
        switchMap((res) => {
          tokenService.setTokens(res.accessToken, res.refreshToken);

          // retry original request with new token
          return next(
            req.clone({
              setHeaders: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${res.accessToken}`,
              },
            })
          );
        }),
        catchError((refreshErr) => {
          tokenService.clearTokens();
          router.navigate(['/auth/login']);
          return throwError(() => refreshErr);
        })
      );
    })
  );
};