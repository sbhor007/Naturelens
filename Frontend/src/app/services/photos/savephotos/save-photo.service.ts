import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../API/api.service';

@Injectable({
  providedIn: 'root',
})
export class SavePhotoService {
  private savedPhotosSubject = new BehaviorSubject<any | null>(null);
  private savedPhotoIdsSubject = new BehaviorSubject<string[]>([]);
  private totalSavedPhotoSubject = new BehaviorSubject<number>(0) //count how how many users can save that particular photo

  readonly savedPhotosState$ = this.savedPhotosSubject.asObservable();
  readonly savedPhotoIdsState$ = this.savedPhotoIdsSubject.asObservable();
  readonly totalSavedPhotoState$ = this.totalSavedPhotoSubject.asObservable();

  constructor(private apiService: ApiService) {}

  savePhoto(photoDetails: any) {
    console.log(photoDetails);

    this.apiService.savePhoto(photoDetails).subscribe({
      next: (res) => {
        this.getSavedPhotos();
        console.log('SAVE-PHOTO-SERVICE : SAVE-PHOTO : RES : \n', res);
        this.totalSavedPhotos(photoDetails)
        alert('photo saved');
      },
      error: (err) => {
        console.log('SAVE-PHOTO-SERVICE : SAVE-PHOTO : ERROR : \n', err);
        alert(`error ${err.error.non_field_errors}`);
      },
    });
  }

  getSavedPhotos() {
    this.apiService.getAllSavedPhotos().subscribe({
      next: (res) => {
        this.savedPhotosSubject.next(res);
        this.savedPhotoIds(res);
        

        console.log('SAVE-PHOTO-SERVICE : GET-SAVED-PHOTOS : RES : ', res);
      },
      error: (err) => {
        console.log('SAVE-PHOTO-SERVICE : GET-SAVED-PHOTOS : err : ', err);
      },
    });
  }

  private savedPhotoIds(res: any) {
    let photoIds;
    // photoIds = res.map((data: any) => data.photo.id);
    photoIds = res.map((data: any) => ({
      objId: data.id,
      photoId: data.photo.id,
    }));
    this.savedPhotoIdsSubject.next(photoIds);
    console.log(
      'SAVE-PHOTO-SERVICE : GET-SAVED-PHOTOS : photoIds : ',
      photoIds
    );
  }

  

  removeSavedPhoto(removableObjectId: string,photoId:string) {
    this.apiService.removeSavedPhoto(removableObjectId).subscribe({
      next: (res) => {
        alert('photo unsave')
        this.getSavedPhotos()
        this.totalSavedPhotos(photoId)
        console.log('SAVE-PHOTO-SERVICE : REMOVE-SAVED-PHOTOS : RES : ', res);
      },
      error: err =>{
        console.log('SAVE-PHOTO-SERVICE : REMOVE-SAVED-PHOTOS : err : ', err);

      }
    });
  }

  //count how how many users can save that particular photo
  totalSavedPhotos(photoId:string){
    this.apiService.totalSavedPhotos(photoId).subscribe({
      next: res =>{
        console.log('SAVE-PHOTO-SERVICE : TOTAL-SAVED-PHOTOS : RES : ',res);
        this.totalSavedPhotoSubject.next(res)
      },
      error: err =>{
         console.log('SAVE-PHOTO-SERVICE : TOTAL-SAVED-PHOTOS : RES : ',err);
      }
    })
  }

  hasUserSavedPhoto(photoId: string) {}
}
