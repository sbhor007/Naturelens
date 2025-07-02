import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import gsap from 'gsap';
import { ImagesService } from '../../services/images/images.service';
import Masonry from 'masonry-layout';
import { Router } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { SavePhotoService } from '../../services/photos/savephotos/save-photo.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, ScrollingModule, NgxShimmerLoadingModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent implements OnInit {
  images1: any[] = [];
  savedPhotoIds: string[] = [];
  savedPhotoObj: any;

  @ViewChildren('card') cards!: QueryList<ElementRef>;

  constructor(
    private imagesService: ImagesService,
    private router: Router,
    private savePhotoService: SavePhotoService
  ) {}

  ngOnInit(): void {
    this.imagesService.hasGetPhotosCalled$.subscribe((res) => {
      console.log('imagesService.hasGetPhotosCalled$ : ', res);
      if (!res) {
        this.imagesService.getAllPhotos();
      }
    });

    this.savePhotoService.hasGetSavedPhotosCalled$.subscribe((res) => {
      if (!res) {
        console.log('savePhotoService.hasGetSavedPhotosCalled$ : ', res);
        this.savePhotoService.getSavedPhotos();
      }
    });

    this.imagesService.photosState$.subscribe((res) => {
      console.log('Res-1\n',res);
      
      this.images1 = res?.results?.map((img: any) => ({ ...img, isLoaded: false }));
      // console.log('this.imagesService.photosState$.subscribe\n',this.images1);
    });

    // console.log('EXPLORE : images\n',this.images1);

    this.savePhotoService.savedPhotoIdsState$.subscribe((res) => {
      this.savedPhotoObj = res;
      console.log('saved photo serrvice: explore:\n',res);
      
      this.savedPhotoIds = res.map((data: any) => data.photoId);
    });
  }

  ngAfterViewInit() {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animate each card as it comes into view
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

    // Also animate already-rendered cards
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

  // getSaved

  savePhoto(photoId: string) {
    this.savePhotoService.savePhoto(photoId);
  }

  removeSavePhoto(photoId: string) {
    console.log('removePhoto : ', photoId);
    // const removableObj = this.savedPhotoObj.filter((data:any) => data.photoId == photoId)
    const removableObj = this.getSavedObject(photoId);
    console.log('removePhoto : ', removableObj);
    this.savePhotoService.removeSavedPhoto(removableObj[0].objId, photoId);
  }

  getSavedObject(photoId: string) {
    return this.savedPhotoObj.filter((data: any) => data.photoId == photoId);
  }
}
