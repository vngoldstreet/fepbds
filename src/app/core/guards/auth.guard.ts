import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { userSignal } from '../stores/user.store';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);

  return userSignal() ? true : true;
};
