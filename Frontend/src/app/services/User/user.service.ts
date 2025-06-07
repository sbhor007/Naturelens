import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../API/api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private profileData: any | null = null;
  private profileState: boolean = false;

  constructor(private http: HttpClient,private apiService:ApiService,private router:Router) {}

  isProfileAvailable() {
    return this.profileState;
  }

  setProfileState(state: boolean) {
    this.profileState = state;
  }

  getProfileData() {
    return this.profileData;
  }

  // TODO:done
  getUserProfile() {
    this.apiService.getProfile().subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.setProfileState(true);
          this.profileData = (res[0]);
        } else {
          this.setProfileState(false);
        }
      },
      error: (err) => {
        this.setProfileState(false);
        this.profileData = (null);
        console.log('error : ', err);
        alert('profile not Available');
      },
    });
  }

  register(userDetails: any){
    this.apiService.register(userDetails).subscribe({
      next: (res) => {
        console.log('Registration Successfully');
        alert('Registration Successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.');
      },
    });
  }

  createProfile(profileDetails: any){
    this.apiService.createProfile(profileDetails).subscribe({
      next: (res) => {
        alert('user profile created');
        console.log(res);
        // this.isLoading = false;
      },
      error: (err) => {
        alert('something went wrong');
        console.log(err);
        // this.isLoading = false;
      },
    });
  }


  updateProfile(profileDetails: any, id: number) {
    
    this.apiService.updateProfile(profileDetails,id).subscribe({
      next: (res) => {
        this.getUserProfile()
        alert('user profile updated');
        console.log(res);
      },
      error: (err) => {
        alert('something went wrong');
        console.log(err);
      },
    });
  }
}
