import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiService } from '../API/api.service';
import { Router } from '@angular/router';
import { LoginState } from '../../model/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginStateSubject.next({
      loading: false,
      error: null,
      authenticated: !!sessionStorage.getItem('access'),
    });
  }

  private loginStateSubject = new BehaviorSubject<LoginState>({
    loading: false,
    error: null,
    authenticated: false,
  });

  readonly loginState$ = this.loginStateSubject.asObservable();

  isAuthenticated(): boolean {
    return this.loginStateSubject.getValue().authenticated;
  }

  getUsername() {
    return sessionStorage.getItem('username');
  }

  getAccessToken() {
    return sessionStorage.getItem('access');
  }

  getRefreshToken() {
    return sessionStorage.getItem('refresh');
  }

  login(loginCredentials: any) {
    console.log('login-1.2');
    this.loginStateSubject.next({
      loading: true,
      error: null,
      authenticated: true,
    });
    console.log('login:', this.loginState$);

    // debugger
    this.apiService.login(loginCredentials).subscribe({
      next: (res) => {
        console.log(res.access);
        const tokens = res.tokens;
        sessionStorage.setItem('access', tokens.access);
        sessionStorage.setItem('refresh', tokens.refresh);
        sessionStorage.setItem('username', res.username);
        this.loginStateSubject.next({
          loading: false,
          error: null,
          authenticated: true,
        });
        console.log('login-1:', this.loginState$);
        this.router.navigate(['user/']);
        alert('Login successful');
      },
      error: (err) => {
        this.loginStateSubject.next({
          loading: false,
          error: err.error?.message || 'Login failed',
          authenticated: false,
        });
        console.log('login-2:', this.loginState$);
      },
    });
  }

  refreshAccessToken(): Observable<any> {
  const refreshToken = this.getRefreshToken();
  if (!refreshToken) {
    return throwError(() => new Error('No refresh token found'));
  }
  return this.apiService.refreshAccessToken(refreshToken).pipe(
    tap((res) => {
      const token = res.token;
      console.log(token);
      
      sessionStorage.setItem('access', res.access);
      // Optionally update state:
      this.loginStateSubject.next({
        loading: false,
        error: null,
        authenticated: true,
      });
    })
  );
}

  logout() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.error('No refresh token found.');
    } else {
      this.apiService.logout(refreshToken).subscribe({
        next: (res) => {
          this.loginStateSubject.next({
            loading: false,
            error: null,
            authenticated: false,
          });
          this.removeToken();
          alert('logout successfully');
          this.router.navigate(['home']);
        },
        error: (err) => {
          console.log('error: ', err);
          alert('logout error');
        },
      });
    }
  }

  removeToken() {
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');
    sessionStorage.removeItem('username');
  }

  
}
