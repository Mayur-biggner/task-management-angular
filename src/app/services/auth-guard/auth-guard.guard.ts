import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../localStorage/local-storage.service';

export const AuthGuardFn: CanActivateFn = (route, state) => {
  const _localStorageService = inject(LocalStorageService);
  if (_localStorageService.isLoggedIn() && _localStorageService.isValidUser()) {
    return true;
  } else {
    inject(Router).navigate(['/login']);
    return false;
  }
};
