import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseURL = environment.baseAPI;
  private profileData: any | null = null;
  private profileState: boolean = false;

  constructor(private http: HttpClient) {}

  isProfileAvailable() {
    return this.profileState;
  }

  setProfileState(state: boolean) {
    this.profileState = state;
  }

  setProfileData(profileData: any) {
    this.profileData = profileData;
  }

  getProfileData() {
    return this.profileData;
  }

  getUserProfile() {
    this.getProfile().subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.setProfileState(true);
          this.setProfileData(res[0]);
        } else {
          this.setProfileState(false);
        }
      },
      error: (err) => {
        this.setProfileState(false);
        this.setProfileData(null);
        console.log('error : ', err);
        alert('profile not Available');
      },
    });
  }

  register(userDetails: any): Observable<any> {
    return this.http.post(`${this.baseURL}register/`, userDetails);
  }

  createProfile(profileDetails: any): Observable<any> {
    return this.http.post(`${this.baseURL}users-profile/`, profileDetails);
  }

  private getProfile(): Observable<any> {
    return this.http.get(`${this.baseURL}users-profile/`);
  }

  updateProfile(profileDetails: any, id: number): Observable<any> {
    return this.http.put(`${this.baseURL}users-profile/${id}/`, profileDetails);
  }
}
