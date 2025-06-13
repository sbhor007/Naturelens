import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  private totalLikesSubject = new BehaviorSubject<number | null>(null)
  readonly totalLikesState$ = this.totalLikesSubject.asObservable()
  constructor(private apiService:ApiService) { }


  likeOrDislike(likeDetails:any){
    this.apiService.likeDislike(likeDetails).subscribe({
      next: res =>{
        console.log(res);
        this.totalLikes(likeDetails.photo)
      },
      error: err =>{
        console.log(err);
      }
    })
  }

  totalLikes(id:string){
    this.apiService.totalLikes(id).subscribe({
      next: res =>{
        console.log(res);
        this.totalLikesSubject.next(res)
      },
      error: err =>{
        console.log(err);
      }
    })
  }
}
