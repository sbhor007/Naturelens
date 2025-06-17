import {
  Component,
  Input,
  AfterViewInit,
  QueryList,
  ElementRef,
  ViewChildren,
  OnInit,
} from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule } from '@angular/common';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { Router } from 'express';

@Component({
  selector: 'app-mansory-layout',
  imports: [CommonModule,NgxShimmerLoadingModule],
  templateUrl: './mansory-layout.component.html',
  styleUrl: './mansory-layout.component.css',
})
export class MansoryLayoutComponent implements AfterViewInit,OnInit{
  @Input() photos: any[] = [];
  @Input() clickHandler!: (photo: any) => void;

  @ViewChildren('card') cards!: QueryList<ElementRef>;

  constructor(private router: Router) { }
  

  ngOnInit(): void {
      console.log('mansulry layout : ',this.photos);
      
  }

  animateCards(cards: QueryList<ElementRef>) {
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
}

ngAfterViewInit() {
  gsap.registerPlugin(ScrollTrigger);
  this.animateCards(this.cards);

  this.cards.changes.subscribe((cards) => this.animateCards(cards));
}
  onImageLoad(img: any) {
    img.isLoaded = !img.isLoaded;
  }

  onClick(photo: any) {
    if (this.clickHandler) this.clickHandler(photo);
  }

  trackByPhotoId(index: number, photo: any): string {
  return photo.id;
}
  

  // photosDetails(photo: any) {
  //   if (photo && photo.id) {
  //     this.router.navigate(['user/photo-details', photo.id], {
  //       state: { photo: photo },
  //     });
  //   } else {
  //     console.error('Photo object is missing an id:', photo);
  //   }
  // }
}