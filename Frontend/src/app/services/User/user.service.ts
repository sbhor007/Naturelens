import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../API/api.service';
import { Router } from '@angular/router';
import { UserProfileState } from '../../model/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private profileData: any | null = null;
  private profileState: boolean = false;
  private userProfileStateSubject = new BehaviorSubject<UserProfileState>({
    loading:false,
    error:null,
    profile:null,
    available:false
  })

  readonly userProfileState$ = this.userProfileStateSubject.asObservable()





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

  updateUserProfileState(partial: Partial<UserProfileState>) {
  this.userProfileStateSubject.next({
    ...this.userProfileStateSubject.getValue(),
    ...partial,
  });
}

  // TODO:done
  getUserProfile() {
    this.updateUserProfileState({
      loading:true
    })
    this.apiService.getProfile().subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.updateUserProfileState({
            loading:false,
            profile:res[0],
            available:true
          })
          this.setProfileState(true);
          this.profileData = (res[0]);
        } else {
          this.setProfileState(false);
          this.updateUserProfileState({
            loading:false,
            profile:null,
            available:false
          })
        }
      },
      error: (err) => {
        this.updateUserProfileState({
            loading:false,
            profile:null,
            error:err,
            available:false
          })
        this.setProfileState(false);
        this.profileData = (null);
        console.log('error : ', err);
        alert('profile not Available');
      },
    });
  }

  register(userDetails: any){
    this.updateUserProfileState({
      loading:true
    })
    this.apiService.register(userDetails).subscribe({
      next: (res) => {
        this.updateUserProfileState({
            loading:false
          })
        console.log('Registration Successfully');
        alert('Registration Successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.updateUserProfileState({
            loading:false
          })
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.');
      },
    });
  }

  createProfile(profileDetails: any){
    console.log("profile Details : ",profileDetails);
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
    console.log("profile Details : ",profileDetails);
    
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
