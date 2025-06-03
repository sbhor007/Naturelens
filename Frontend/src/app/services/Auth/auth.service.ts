import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
// API_URL = import.meta.env.API_URL 
API_URL='http://localhost:3000'
private baseURL = environment.baseAPI

  constructor(private http:HttpClient) { }

  getAllUsers():Observable<any>{
    return this.http.get(`${this.API_URL}/users`)
  }

  register(user:any):Observable<any>{
    console.log(user);
    console.log(this.API_URL);
    
    return this.http.post(`${this.API_URL}/users`,user)
  }

  

  login(loginCredentials:any):Observable<any>{
   
    return this.http.post(`${this.baseURL}login/`,loginCredentials)
  }

}

