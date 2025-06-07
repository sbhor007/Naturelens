import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../Auth/auth.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseURL = environment.baseAPI;
  private isLoggedIn$ = false;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = !!sessionStorage.getItem('access');
  }

  /*auth API */

  login(loginCredentials: any): Observable<any> {
    return this.http.post(`${this.baseURL}login/`, loginCredentials);
  }

  logout(refreshToken: string) {
    console.log('refresh Token : ', refreshToken);
    return this.http.post(`${this.baseURL}logout/`, {
      refresh: refreshToken,
    });
  }

  refreshAccessToken(refreshToken: string) {
    return this.http.post<any>(`${this.baseURL}token/refresh/`, {
      refresh: refreshToken,
    });
  }

  /* User API */
  register(userDetails: any): Observable<any> {
    return this.http.post(`${this.baseURL}register/`, userDetails);
  }

  createProfile(profileDetails: any): Observable<any> {
    return this.http.post(`${this.baseURL}users-profile/`, profileDetails);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseURL}users-profile/`);
  }

  updateProfile(profileDetails: any, id: number): Observable<any> {
    return this.http.put(`${this.baseURL}users-profile/${id}/`, profileDetails);
  }

  
}


