import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authRedirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  const token = tokenService.getAccessToken();
  if (token) {
    const role = localStorage.getItem('role') ?? 'owner';
    return router.parseUrl(`/${role}/dashboard`);
  }

  return true;
};
