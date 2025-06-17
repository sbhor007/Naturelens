import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
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
    private savePhotos: SavePhotoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.savePhotos.getSavedPhotos();
    this.savePhotos.savedPhotosState$.subscribe(
      (res) => {
        this.savedPhotosDetails$ = res.map((img: any) => ({ ...img, isLoaded: false }));
        this.cdr.detectChanges();
        console.log('Fetched saved posts:', this.savedPhotosDetails$);
      },
      (error) => {
        console.error('Error fetching saved photos:', error);
      }
    );
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
}
