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

  private hasGetPhotosCalled = new BehaviorSubject<boolean>(false);
  private hasGetUserPhotosCalled = new BehaviorSubject<boolean>(false);

  readonly hasGetPhotosCalled$ = this.hasGetPhotosCalled.asObservable();
  readonly hasGetUserPhotosCalled$ = this.hasGetUserPhotosCalled.asObservable();

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router
  ) {
    console.log('component loaded');
    this.getAllPhotos();
    this.getPhotoCategories();
    this.getTags();
  }

  getAllPhotos() {
    this.apiService.getAllPhotos().subscribe({
      next: (res) => {
        console.log('IMAGE-SERVICE::getAllPhotos : res :\n ',res);
        
        this.photosSubject.next(res);
        this.hasGetPhotosCalled.next(true);
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
    console.log('Photos Details : ', photosDetails);
    this.apiService.createPhoto(photosDetails).subscribe({
      next: (res) => {
        this.photosSubject.next(res);
        this.getAllPhotos();
        this.getPhotoCategories();
        this.getTags();
        this.getUserPhotos();
        console.log('photo upload successfully', res);
        // alert('photo upload successfully');
        // this.router.navigate(['/user/profile/posts']);
      },
      error: (err) => {
        this.photosSubject.next(null);
        alert('photo upload fail');
      },
    });
  }

  getUserPhotos() {
    this.apiService.getUserPhotos().subscribe({
      next: (res) => {
        console.log('GET_USER_PHOTO : RES : ', res);

        this.userPhotosSubject.next(res);
        this.hasGetUserPhotosCalled.next(true);
      },
      error: (err) => {
        console.log('GET_USER_PHOTO : ', err);
      },
    });
  }

  updatePhoto(photoDetails: any, photoId: string) {
    console.log('photoDetails : \n', photoDetails);

    this.apiService.updatePhoto(photoDetails, photoId).subscribe({
      next: (res) => {
        console.log('UPDATE_PHOTO : RES : \n', res);
        this.getAllPhotos();
        alert('update successful');
      },
      error: (err) => {
        console.log('UPDATE_PHOTO : ', err);
        alert(err);
      },
    });
  }

  /* Delete Photo by Id */
  deletePhoto(photoId: string) {
    this.apiService.deletePhoto(photoId).subscribe({
      next: (res) => {
        console.log('IMAGE-SERVICE : deletePhoto: res \n', res);
        this.getUserPhotos();
        alert('photo deleted');
      },
      error: (err) => {
        console.log('IMAGE-SERVICE : deletePhoto: err \n', err);
        alert('something went to wrong');
      },
    });
  }
}
