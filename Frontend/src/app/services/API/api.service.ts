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
    })
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
    return this.http.post(`${this.baseURL}photos/photo/`,photoDetails)
  }

  getAllPhotos():Observable<any>{
    return this.http.get(`${this.baseURL}photos/photo/`)
  }

  getUserPhotos():Observable<any>{
    return this.http.get(`${this.baseURL}photos/photo/?mine=true`)
  }
  getPhotoCategories():Observable<any>{
    return this.http.get(`${this.baseURL}photos/category/`)
  }

  getTags():Observable<any>{
    return this.http.get(`${this.baseURL}photos/tag/`)
  }

  /* save photos */
  savePhoto(savePhotoDetails:any):Observable<any>{
    return this.http.post(`${this.baseURL}photos/save-photo/`,savePhotoDetails)
  }

  getAllSavedPhotos():Observable<any>{
    return this.http.get(`${this.baseURL}photos/save-photo/`)
  }

  removeSavedPhoto(removableObjectId:string):Observable<any>{
    return this.http.delete(`${this.baseURL}photos/save-photo/${removableObjectId}/`)
  }

  totalSavedPhotos(photoId:string):Observable<any>{
    return this.http.get(`${this.baseURL}photos/save-photo/count/?photoId=${photoId}`)
  }
  // updatePhotos(updatePhotoDetails:any,id)

  /*end Photos API */

  /* social model APi */

  likeDislike(likeDetails:any):Observable<any>{
    return this.http.post<any>(`${this.baseURL}social/photo-like/`,likeDetails)
  }

  totalLikes(id:string):Observable<any>{
    return this.http.get(`${this.baseURL}social/photo-like/like-count/?id=${id}`)
  }

  isLiked(id:string):Observable<any>{
    return this.http.get(`${this.baseURL}social/photo-like/is-liked/?id=${id}`)
  }
  
  createComment(commentDetails:any):Observable<any>{
    return this.http.post(`${this.baseURL}social/comment/`,commentDetails)
  }

  getPhotoComments(id:string):Observable<any>{
    return this.http.get(`${this.baseURL}social/comment/photo-comments/?id=${id}`)
  }

  deleteComment(commentId:string):Observable<any>{
    return this.http.delete(`${this.baseURL}social/comment/${commentId}/`)
  }

  updateComment(formData: FormData, commentId: string):Observable<any> {
    return this.http.patch(`${this.baseURL}social/comment/${commentId}/`,formData)
  }


  


  
}


