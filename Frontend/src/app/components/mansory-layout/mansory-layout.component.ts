import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-mansory-layout',
  imports: [CommonModule],
  templateUrl: './mansory-layout.component.html',
  styleUrl: './mansory-layout.component.css',
})
export class MansoryLayoutComponent implements AfterViewInit,OnInit{
  @Input() photos: any[] = [];
  // @Input() clickHandler!: (photo: any) => void;
  @ViewChild('masonryGrid') masonryGrid!: ElementRef;

  private msnry: any;
    // private imageURL = environment.imagesURL;

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('INPUT data:',this.photos);
    
  }
  
  async ngAfterViewInit() {
    if (this.photos.length) {
      this.initMasonry();
    }
  }

  async initMasonry() {
    if (typeof window !== 'undefined') {
      const Masonry = (await import('masonry-layout')).default;
      const imagesLoaded = (await import('imagesloaded')).default;

      const grid = this.masonryGrid.nativeElement;

      if (!this.msnry) {
        this.msnry = new Masonry(grid, {
          itemSelector: '.grid-item',
          columnWidth: '.grid-sizer',
          gutter: 16,
          percentPosition: true
        });
      }

      imagesLoaded(grid).on('progress', () => {
        this.msnry.layout?.();
      });
    }
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