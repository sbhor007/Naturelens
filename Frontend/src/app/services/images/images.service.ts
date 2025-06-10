import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiService } from '../API/api.service';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  private photoCategoriesSubject = new BehaviorSubject<any | null>(null)
  private tagsSubject = new BehaviorSubject<any | null>(null)

  readonly photoCategoriesState$ = this.photoCategoriesSubject.asObservable();
  readonly tagsState$ = this.tagsSubject.asObservable();

  constructor(private http:HttpClient,private apiService:ApiService) { }

  getAllPhotos(){
    this.apiService.getAllPhotos().subscribe({
      next: res =>{
        console.log("res : ",res);
      },
      error: err =>{
        console.error('ERROR:',err);
      }
    })
  }

  getPhotoCategories(){
    this.apiService.getPhotoCategories().subscribe({
      next:res =>{
        this.photoCategoriesSubject.next(res)
        console.log(res);
      },
      error:err =>{
        console.error(err)
      }
    })
  }

  getTags(){
    this.apiService.getTags().subscribe({
      next: res =>{
        this.tagsSubject.next(res)
        console.log(res);
      },
      error: err =>{
        console.error(err)
      }
    })
  }

}
