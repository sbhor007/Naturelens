import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseURL = environment.baseAPI;
  private isLoggedIn$ = false;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = !!sessionStorage.getItem('access');
  }

  /*start auth API */
  login(loginCredentials: any): Observable<any> {
    return this.http.post(`${this.baseURL}user/login/`, loginCredentials);
  }

  logout(refreshToken: string) {
    console.log('refresh Token : ', refreshToken);
    return this.http.post(`${this.baseURL}user/logout/`, {
      refresh: refreshToken,
    });
  }

  refreshAccessToken(refreshToken: string) {
    return this.http.post<any>(`${this.baseURL}user/token/refresh/`, {
      refresh: refreshToken,
    });
  }
  
  /*End auth API */

  /*start User API */
  register(userDetails: any): Observable<any> {
    return this.http.post(`${this.baseURL}user/register/`, userDetails);
  }

  createProfile(profileDetails: any): Observable<any> {
    return this.http.post(`${this.baseURL}user/profile/`, profileDetails);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseURL}user/profile/`);
  }

  updateProfile(profileDetails: any, id: number): Observable<any> {
    return this.http.put(`${this.baseURL}user/profile/${id}/`, profileDetails);
  }
  /*start User API */

  /*start Module Photos API */
  // Photos API
  createPhoto(photoDetails:any):Observable<any>{
    return this.http.post(`${this.baseURL}photos/photo/`,{photoDetails:photoDetails})
  }

  getAllPhotos():Observable<any>{
    return this.http.get(`${this.baseURL}photos/photo/`)
  }

  getPhotoCategories():Observable<any>{
    return this.http.get(`${this.baseURL}photos/category/`)
  }

  getTags():Observable<any>{
    return this.http.get(`${this.baseURL}photos/tag/`)
  }

  // updatePhotos(updatePhotoDetails:any,id)

  /*end Photos API */


  
}


