import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  API_URL='http://localhost:3000'

  constructor(private http:HttpClient) { }

  // getImages():Observable<any>{
  //   return this.http.get(`${this.API_URL}/images`)
  // }
}
