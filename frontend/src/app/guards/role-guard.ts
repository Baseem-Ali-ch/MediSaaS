import { inject } from '@angular/core';
import { CanActivateFn, Router, CanMatchFn, Route, UrlSegment } from '@angular/router';

export const VALID_ROLES = ['admin', 'owner', 'staff'];

export const roleMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  if (segments.length > 0 && VALID_ROLES.includes(segments[0].path)) {
    return true;
  }
  return false;
};

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const userRole = localStorage.getItem('role');
  const urlRole = route.paramMap.get('role');

  if (!urlRole || !VALID_ROLES.includes(urlRole)) {
    return router.createUrlTree(['/auth/login']);
  }

  if (!userRole) {
    return router.createUrlTree(['/auth/login']);
  }

  if (urlRole !== userRole) {
    return router.createUrlTree([`/${userRole}/dashboard`]);
  }

  return true;
};
