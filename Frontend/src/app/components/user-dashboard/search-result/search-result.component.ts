import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SearchService } from '../../../services/search/search.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.css',
})
export class SearchResultComponent implements OnInit, AfterViewInit {
  searchedImages: any[] = [];
  @ViewChild('masonryGrid') masonryGrid!: ElementRef;
  private msnry: any;

  items = [
    { image: 'https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800', title: 'Item 1' },
    { image: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Item 2' },
    { image: 'https://images.pexels.com/photos/35600/road-sun-rays-path.jpg?auto=compress&cs=tinysrgb&w=800', title: 'Item 3' },
    { image: 'https://images.pexels.com/photos/349758/pexels-photo-349758.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Item 4' },
    { image: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
       title: 'Item 5' }
  ];

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit(): void {
    this.searchService.searchedPhoto$.subscribe((res) => {
      this.searchedImages = res.results;
      setTimeout(() => {
        this.initMasonry();
      }, 0);
    });
  }

  async ngAfterViewInit() {
    if (this.searchedImages.length) {
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
