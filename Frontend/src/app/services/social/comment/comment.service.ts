import { Injectable } from '@angular/core';
import { ApiService } from '../../API/api.service';
import { BehaviorSubject } from 'rxjs';
import { error } from 'node:console';

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

  getPhotoComments(photoId:string){
    this.apiService.getPhotoComments(photoId).subscribe({
      next: res =>{
        console.log('COMMENT-SERVICE : GET_PHOTO_COMMENTS\n',res);
        this.photoCommentSubject.next(res)
      },
      error: err =>{
        console.log('COMMENT-SERVICE : GET_PHOTO_COMMENTS: ERROR\n',err);
      }
    })
  }

  updateComment(formData: FormData,commentId:string) {
    this.apiService.updateComment(formData,commentId).subscribe({
      next: res =>{
        
        this.getPhotoComments(res.photo)
        console.log('COMMENT-SERVICE : UPDATE\n',res);
      },
      error: err =>{
        console.log('COMMENT-SERVICE : UPDATE: ERROR\n',err);
      }
    })
  }

  deleteComment(commentId:string,photoId:string){
    this.apiService.deleteComment(commentId).subscribe({
      next: res =>{
        console.log('COMMENT-SERVICE : DELETE_COMMENT\n',res);
        this.getPhotoComments(photoId)
        alert('comment deleted')
      },
      error: err =>{
        console.log('COMMENT-SERVICE : DELETE_COMMENT : ERROR\n',err);

      }
    })
  }

}
