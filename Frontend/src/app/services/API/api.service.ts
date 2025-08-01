import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private baseURL = environment.baseAPI;
  private isLoggedIn$ = false;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = !!sessionStorage.getItem("access");
  }

  /*start auth API */
  login(loginCredentials: any): Observable<any> {
    return this.http.post(`${this.baseURL}user/login/`, loginCredentials);
  }

  logout(refreshToken: string) {
    console.log("refresh Token : ", refreshToken);
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

  /* Email API's */

  //send otp
  sendOTP(email: string): Observable<any> {
    console.log('baseURL:', this.baseURL);
    
    return this.http.post(`${this.baseURL}mail/send-otp/?email=${email}`, {});
  }

  //validate OTP
  verifyOTP(email: string, Otp: string) {
    console.log("api-service-check-email: ", email);

    const validationData = {
      email: email,
      otp: Otp,
    };
    return this.http.post(`${this.baseURL}mail/verify-otp/`, validationData);
  }

  /*start Module Photos API */
  // Photos API
  createPhoto(photoDetails: any): Observable<any> {
    return this.http.post(`${this.baseURL}photos/photo/`, photoDetails);
  }

  getAllPhotos(): Observable<any> {
    return this.http.get(`${this.baseURL}photos/photo/`);
  }
  //load photos when scroll triggered
  getPhotosByUrl(url: string, offSet: number): Observable<any> {
    return this.http.get(
      `http://172.18.0.1:8000/api/v1/photos/photo/?limit=30&offset=${offSet}`,
    );
  }

  getUserPhotos(): Observable<any> {
    return this.http.get(`${this.baseURL}photos/photo/user-photos/`);
  }

  updatePhoto(photoDetails: any, photoId: string): Observable<any> {
    return this.http.put(
      `${this.baseURL}photos/photo/${photoId}/`,
      photoDetails,
    );
  }
  /*end Module Photos API */

  getPhotoCategories(): Observable<any> {
    return this.http.get(`${this.baseURL}photos/category/`);
  }

  deletePhoto(photoId: string): Observable<any> {
    return this.http.delete(`${this.baseURL}photos/photo/${photoId}/`);
  }

  getTags(): Observable<any> {
    return this.http.get(`${this.baseURL}photos/tag/`);
  }

  /* save photos */
  savePhoto(savePhotoDetails: any): Observable<any> {
    return this.http.post(
      `${this.baseURL}photos/save-photo/`,
      savePhotoDetails,
    );
  }

  getAllSavedPhotos(): Observable<any> {
    return this.http.get(`${this.baseURL}photos/save-photo/`);
  }

  removeSavedPhoto(removableObjectId: string): Observable<any> {
    return this.http.delete(
      `${this.baseURL}photos/save-photo/${removableObjectId}/`,
    );
  }

  totalSavedPhotos(photoId: string): Observable<any> {
    return this.http.get(
      `${this.baseURL}photos/save-photo/count/?photoId=${photoId}`,
    );
  }
  // updatePhotos(updatePhotoDetails:any,id)

  /*end Photos API */

  /* social model APi */

  likeDislike(likeDetails: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}social/photo-like/`,
      likeDetails,
    );
  }

  totalLikes(id: string): Observable<any> {
    return this.http.get(
      `${this.baseURL}social/photo-like/like-count/?id=${id}`,
    );
  }

  isLiked(id: string): Observable<any> {
    return this.http.get(`${this.baseURL}social/photo-like/is-liked/?id=${id}`);
  }

  createComment(commentDetails: any): Observable<any> {
    return this.http.post(`${this.baseURL}social/comment/`, commentDetails);
  }

  getPhotoComments(id: string): Observable<any> {
    return this.http.get(
      `${this.baseURL}social/comment/photo-comments/?id=${id}`,
    );
  }

  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(`${this.baseURL}social/comment/${commentId}/`);
  }

  updateComment(formData: FormData, commentId: string): Observable<any> {
    return this.http.patch(
      `${this.baseURL}social/comment/${commentId}/`,
      formData,
    );
  }

  /*Search Api start */
  searchPhotos(searchTerm: string): Observable<any> {
    return this.http.get(`${this.baseURL}photos/search-photos/${searchTerm}/`);
  }
  /*Search Api start */
}
