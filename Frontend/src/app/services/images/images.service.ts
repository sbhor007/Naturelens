import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiService } from '../API/api.service';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private photoCategoriesSubject = new BehaviorSubject<any | null>(null);
  private tagsSubject = new BehaviorSubject<any | null>(null);
  private photosSubject = new BehaviorSubject<any | null>(null);
  private userPhotosSubject = new BehaviorSubject<any | null>(null);

  

  readonly photoCategoriesState$ = this.photoCategoriesSubject.asObservable();
  readonly tagsState$ = this.tagsSubject.asObservable();
  readonly photosState$ = this.photosSubject.asObservable();
  readonly userPhotosState$ = this.userPhotosSubject.asObservable();

  private hasGetPhotosCalled = new BehaviorSubject<boolean>(false)
  private hasGetUserPhotosCalled = new BehaviorSubject<boolean>(false)

  readonly hasGetPhotosCalled$ = this.hasGetPhotosCalled.asObservable()
  readonly hasGetUserPhotosCalled$ = this.hasGetUserPhotosCalled.asObservable()

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router
  ) {
    console.log('component loaded');
    this.getAllPhotos()
    this.getPhotoCategories()
    this.getTags()
    
  }

  getAllPhotos() {
    this.apiService.getAllPhotos().subscribe({
      next: (res) => {
        // if (Array.isArray(res)) {
        //   res = res.sort(() => Math.random() - 0.5);
        // }
        this.photosSubject.next(res)
        this.hasGetPhotosCalled.next(true)
        console.log('get-all-photos-res : ', res);
      },
      error: (err) => {
        console.error('ERROR:', err);
      },
    });
  }

  getPhotoCategories() {
    this.apiService.getPhotoCategories().subscribe({
      next: (res) => {
        this.photoCategoriesSubject.next(res);
        // console.log(res);
      },
      error: (err) => {
        // console.error(err);
      },
    });
  }

  getTags() {
    this.apiService.getTags().subscribe({
      next: (res) => {
        this.tagsSubject.next(res);
        // console.log(res);
      },
      error: (err) => {
        // console.error(err);
      },
    });
  }

  uploadPhotos(photosDetails: any) {
    console.log("Photos Details : ",photosDetails);
    this.apiService.createPhoto(photosDetails).subscribe({
      next: (res) => {
        this.photosSubject.next(res);
        this.getAllPhotos()
        this.getPhotoCategories()
        this.getTags()
        alert('photo upload successfully');
        this.router.navigate(['/user/profile/posts']);
      },
      error: (err) => {
        this.photosSubject.next(null);
        alert('photo upload fail');
      },
    });
  }

  getUserPhotos(){
    this.apiService.getUserPhotos().subscribe({
      next: res =>{
        this.userPhotosSubject.next(res)
        this.hasGetUserPhotosCalled.next(true)
      },
      error: err =>{
        console.log('GET_USER_PHOTO : ',err);
        
      }
    })
  }

}
