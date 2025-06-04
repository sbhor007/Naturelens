import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // API_URL = import.meta.env.API_URL
  API_URL = 'http://localhost:3000';
  private baseURL = environment.baseAPI;
  // private isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private isLoggedIn$ = false;

  constructor(private http: HttpClient) {
      this.isLoggedIn$ = !!sessionStorage.getItem('access')
  }

  /* Retrive Username */
  getUsername(){
    return sessionStorage.getItem('username')
  }

  /* set login state */
  setLoginState(state: boolean) {
    this.isLoggedIn$ = state;
  }

  /* check user is authenticated or not */
  isAuthenticated() {
    return this.isLoggedIn$
  }

  /* call Login API */
  login(loginCredentials: any): Observable<any> {
    return this.http.post(`${this.baseURL}login/`, loginCredentials);
  }

  /* get Access Token */
  getAccessToken() {
    return sessionStorage.getItem('access');
  }

  /* get refresh token */
  getRefreshToken() {
    return sessionStorage.getItem('refresh');
  }

  /* call Logout API */
  logout() {
    console.log('refresh Token : ', this.getRefreshToken());
   

    return this.http.post(
      `${this.baseURL}logout/`,
      { refresh: this.getRefreshToken() },
    );
  }

  /* refresh access Token */
  refreshAccessToken() {
    return this.http
      .post<any>(`${this.baseURL}token/refresh/`, {
        refresh: this.getRefreshToken(),
      })
      .pipe(
        tap((res) => {
          const token = res.tokens;
          sessionStorage.setItem('access', token.access);
        })
      );
  }

  /* remove tokens */
  removeToken() {
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');
    this.isLoggedIn$ = false
  }
}
