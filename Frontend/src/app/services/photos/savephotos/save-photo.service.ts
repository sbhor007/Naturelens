import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../API/api.service';

@Injectable({
  providedIn: 'root',
})
export class SavePhotoService {
  private savedPhotosSubject = new BehaviorSubject<any | null>(null);

  readonly savedPhotosState$ = this.savedPhotosSubject.asObservable();

  constructor(private apiService: ApiService) {}

  savePhoto(photoDetails: any) {
    this.apiService.savePhoto(photoDetails).subscribe({
      next: (res) => {
        console.log(`SAVE-PHOTO-SERVICE : SAVE-PHOTO : RES : \n${res}`);
      },
      error: (err) => {
        console.log(`SAVE-PHOTO-SERVICE : SAVE-PHOTO : ERROR : \n${err}`);
      },
    });
  }

  getSavedPhotos() {
    this.apiService.getAllSavedPhotos().subscribe({
      next: (res) => {
        this.savedPhotosSubject.next(res)
        console.log('SAVE-PHOTO-SERVICE : GET-SAVED-PHOTOS : RES : ', res);
      },
      error: (err) => {
        console.log('SAVE-PHOTO-SERVICE : GET-SAVED-PHOTOS : err : ', err);
      },
    });
  }
}
