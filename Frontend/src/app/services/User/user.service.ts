import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL = environment.baseAPI

  constructor(private http:HttpClient) { }

  register(userDetais:any):Observable<any>{
    return this.http.post(`${this.baseURL}register/`,userDetais)
  }

  createProfile(profileDetails:any):Observable<any>{
    return this.http.post(`${this.baseURL}users-profile/`,profileDetails)
  }
}
