import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { error } from 'console';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OTPService {

  constructor(
    private apiService:ApiService 
  ) { }

  sendOTP(email:string){
    this.apiService.sendOTP(email).subscribe({
      next: (res) => {
        console.log('OTP-SERVICE :: sendOTP :: res :\n',res);
      },
      error: (err) => {
        console.log('OTP-SERVICE :: sendOTP :: err :\n',err);
      }
    })
  }

  verifyOTP(email:string,OTP:string):Observable<boolean>{

    return this.apiService.verifyOTP(email,OTP).pipe(
      map((res) =>{
        console.log('OTP-SERVICE :: verifyOTP :: res :\n',res);
        return true
      }),
      catchError((err) => {
      console.log('OTP-SERVICE :: verifyOTP :: error :\n', err);
      return of(false); // return false if there's an error
    })
    )   
  }


}
