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

  readonly photoCategoriesState$ = this.photoCategoriesSubject.asObservable();
  readonly tagsState$ = this.tagsSubject.asObservable();
  readonly photosState$ = this.photosSubject.asObservable();

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
        this.photosSubject.next(res)
        // console.log('res : ', res);
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
}
