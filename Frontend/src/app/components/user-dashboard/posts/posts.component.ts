import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ImagesService } from '../../../services/images/images.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, NgModelGroup } from '@angular/forms';
import Masonry from 'masonry-layout';
import { Router } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

@Component({
  selector: 'app-posts',
  imports: [CommonModule, ScrollingModule, NgxShimmerLoadingModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  userPosts: any[] = [];

  @ViewChildren('card') cards!: QueryList<ElementRef>;

  constructor(
    private router: Router,
    private imageService:ImagesService
  ) {
    this.imageService.getUserPhotos();
  }

  ngOnInit(): void {
    this.imageService.userPhotosState$.subscribe((state) => {
      this.userPosts = state.map((img: any) => ({ ...img, isLoaded: false }));
    });

    console.log('userPostState : ',this.userPosts);   
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
