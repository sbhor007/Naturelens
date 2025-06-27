import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { SavePhotoService } from '../../../services/photos/savephotos/save-photo.service';
import { Router } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { CommonModule } from '@angular/common';
import { stat } from 'fs';

@Component({
  selector: 'app-saved',
  imports: [CommonModule, ScrollingModule, NgxShimmerLoadingModule],
  templateUrl: './saved.component.html',
  styleUrl: './saved.component.css',
})
export class SavedComponent implements OnInit {
  savedPhotosDetails$: any[] = [];

  @ViewChildren('card') cards!: QueryList<ElementRef>;
  constructor(
    private savePhotoService: SavePhotoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.savePhotoService.getSavedPhotos();
    this.savePhotoService.savedPhotosState$.subscribe((res) => {
      this.savedPhotosDetails$ = res.results.map((img: any) => ({
        ...img,
        isLoaded: false,
      }));
      this.cdr.detectChanges();
      console.log('Fetched saved posts:', this.savedPhotosDetails$);
    });
  }

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);

    this.cards.changes.subscribe((cards: QueryList<ElementRef>) => {
      cards.forEach((card, i) => {
        gsap.from(card.nativeElement, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          delay: i * 0.05,
          scrollTrigger: {
            trigger: card.nativeElement,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });
    });

    this.cards.forEach((card, i) => {
      gsap.from(card.nativeElement, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.05,
        scrollTrigger: {
          trigger: card.nativeElement,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  onImageLoad(event: Event, img: any) {
    img.isLoaded = true;
    this.cdr.detectChanges();
  }

  onImageError(img: any) {
    img.isLoaded = true;
    this.cdr.detectChanges();
    console.error('Image failed to load:', img.image);
  }

  photosDetails(photo: any) {
    if (photo && photo.id) {
      this.router.navigate(['user/photo-details', photo.id], {
        state: { photo: photo },
      });
    } else {
      console.error('Photo object is missing an id:', photo);
    }
  }

  removeSavePhoto(photoId: string) {
    console.log('removePhoto : ', photoId);
    // const removableObj = this.savedPhotoObj.filter((data:any) => data.photoId == photoId)
    const removableObj = this.getSavedObject(photoId);
    console.log('removePhoto : ', removableObj);
    this.savePhotoService.removeSavedPhoto(removableObj[0].id, photoId);
  }

  getSavedObject(photoId: string) {
    this.savedPhotosDetails$.forEach((data: any) => {
      if (data.photo.id == photoId) {
        console.log(data.photo.id, '----', data.id);
      }
      console.log(data.photo);
      console.log(data.photo.id, '----', photoId);
    });
    return this.savedPhotosDetails$.filter(
      (data: any) => data.photo.id == photoId
    );
  }
}
