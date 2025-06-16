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
import { ScrollingModule } from '@angular/cdk/scrolling'; // Import ScrollingModule
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule,ScrollingModule,NgxShimmerLoadingModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent implements OnInit {
  
 images1: any[] = [];

  @ViewChildren('card') cards!: QueryList<ElementRef>;

  constructor(private imagesService: ImagesService, private router: Router) {
    this.imagesService.getAllPhotos();
  }

  ngOnInit(): void {
    this.imagesService.photosState$.subscribe((state) => {
      this.images1 = state.map((img: any) => ({ ...img, isLoaded: false }));
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
}
