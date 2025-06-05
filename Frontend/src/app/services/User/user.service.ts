import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL = environment.baseAPI
  private profileData:any | null = null
  private profileState:boolean = false

  constructor(private http:HttpClient) { }

  isProfileAvailable(){
    return this.profileState
  }

  setProfileState(state:boolean){
    this.profileState = state
  }

  setProfileData(profileData:any){
    this.profileData = profileData
  }

  getProfileData(){
    return this.profileData
  }



  register(userDetails:any):Observable<any>{
    return this.http.post(`${this.baseURL}register/`,userDetails)
  }

  createProfile(profileDetails:any):Observable<any>{
    return this.http.post(`${this.baseURL}users-profile/`,profileDetails)
  }

  getProfile():Observable<any>{
    return this.http.get(`${this.baseURL}users-profile/`)
  }

  updateProfile(profileDetails:any,id:number):Observable<any>{
    return this.http.put(`${this.baseURL}users-profile/${id}/`,profileDetails)
  }
}
