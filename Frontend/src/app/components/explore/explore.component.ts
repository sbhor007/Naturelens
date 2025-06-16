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
  
  images1: any | null;

  constructor(private imagesService: ImagesService, private router: Router) {
    this.imagesService.getAllPhotos();
  }
  ngOnInit(): void {
    
    this.imagesService.photosState$.subscribe((state) => {
      this.images1 = state.map((img: any) => ({ ...img, isLoaded: false }));
    });
    console.log(this.images1);
  }

  

  @ViewChildren('card') cards!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.cards.forEach((card, i) => {
      gsap.from(card.nativeElement, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1,
        scrollTrigger: {
          trigger: card.nativeElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  masonry: Masonry | null = null;
onImageLoad(event: Event, img: any) {
    img.isLoaded = true; // Mark image as loaded
    if (this.masonry && typeof this.masonry.layout === 'function') {
      this.masonry.layout();
    }
  }

  photosDetails(photo: any) {
    console.log('photo :', photo);
    console.log('function call');
    if (photo && photo.id) {
      this.router.navigate(['user/photo-details', photo.id], { state: { photo:photo } });
    } else {
      console.error('Photo object is missing an id:', photo);
    }
  }
}
