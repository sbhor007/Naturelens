import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../API/api.service';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private totalLikesSubject = new BehaviorSubject<number | null>(null)
    private isLikedSubject = new BehaviorSubject<boolean | null>(null)
    readonly totalLikesState$ = this.totalLikesSubject.asObservable()
    readonly isLikedState$ = this.isLikedSubject.asObservable()
    constructor(private apiService:ApiService) { }
  
  
    likeOrDislike(likeDetails:any){
      this.apiService.likeDislike(likeDetails).subscribe({
        next: res =>{
          // console.log('likeOrDislike-service',res);
          this.isLikedSubject.next(res.isLike)
          // this.isLiked(likeDetails.photo)s
          this.totalLikes(likeDetails.photo)
  
        },
        error: err =>{
          console.log('LIKE_OR_DISLIKES',err);
        }
      })
    }
  
    totalLikes(id:string){
      this.apiService.totalLikes(id).subscribe({
        next: res =>{
          // console.log(res);
          this.totalLikesSubject.next(res)
        },
        error: err =>{
          console.log('TOTAL_LIKES',err);
        }
      })
    }
  
    isLiked(id:string){
      this.apiService.isLiked(id).subscribe({
        next: res =>{
          // console.log('IS_LIKED',res.isLiked);
          this.isLikedSubject.next(res.isLiked)
        },
        error: err =>{
          console.log('IS_LIKED',err);
          
        }
      })
    }
}
