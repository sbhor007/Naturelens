import { Injectable } from '@angular/core';
import { ApiService } from '../../API/api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private photoCommentSubject = new BehaviorSubject<any | null>(null)
  
  readonly photoCommentState$ = this.photoCommentSubject.asObservable()

  constructor(private apiService:ApiService) { }

  createComment(commentDetails:any){
    this.apiService.createComment(commentDetails).subscribe({
      next: res =>{
        this.getPhotoComments(commentDetails.get('photo'))
        
        console.log('COMMENT-SERVICE : CREATE_COMMENT\n',res);
      },
      error: err =>{
        console.log('COMMENT-SERVICE : CREATE_COMMENT : ERROR\n',err);
      }
    })
  }

  getPhotoComments(id:string){
    this.apiService.getPhotoComments(id).subscribe({
      next: res =>{
        console.log('COMMENT-SERVICE : GET_PHOTO_COMMENTS\n',res);
        this.photoCommentSubject.next(res)
      },
      error: err =>{
        console.log('COMMENT-SERVICE : GET_PHOTO_COMMENTS: ERROR\n',err);
      }
    })
  }

}
