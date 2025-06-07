import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/Auth/auth.service';
import { map, Observable, take } from 'rxjs';
import { LoginState } from '../model/models';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService)
  const router = inject(Router)
  
  console.log(authService.isAuthenticated());
  
  
  if(!authService.isAuthenticated()){
    router.navigate(['login'])
    return false
  }

  return true
  
};
