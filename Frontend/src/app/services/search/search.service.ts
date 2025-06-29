import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../API/api.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchedPhotoSubject = new BehaviorSubject<any | null>(null);

  readonly searchedPhoto$ = this.searchedPhotoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router
  ) {}

  searchPhotos(searchTerm: string) {
    this.apiService.searchPhotos(searchTerm).subscribe({
      next: res =>{
        console.log('SEARCH-SERVICE: SEARCH-PHOTOS: RES:\n',res);
        this.searchedPhotoSubject.next(res)
        // if(res.count > 0)
          this.router.navigate(['user/search-result'])
        // else
          // this.router.navigate(['user/'])
      },
      error: err =>{
        console.log('SEARCH-SERVICE: SEARCH-PHOTOS: ERR:\n',err);
      }
    })
  }
}
