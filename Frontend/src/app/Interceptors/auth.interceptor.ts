import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/Auth/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError, switchMap } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

  
  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authService.getRefreshToken()) {
        // Try refreshing token
        return authService.refreshAccessToken().pipe(
          switchMap(() => {
            const newToken = authService.getAccessToken();
            const cloned = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(cloned);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
