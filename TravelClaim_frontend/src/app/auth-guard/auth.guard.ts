import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (sessionStorage.length > 0) {
    const login = sessionStorage.getItem("auth");
    if (login == "false") {
      router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  } else {
    router.navigate(['/login']);
    return false;
  }

};
