import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import Masonry from 'masonry-layout';

@Component({
  selector: 'app-mansory-layout',
  imports: [CommonModule],
  templateUrl: './mansory-layout.component.html',
  styleUrl: './mansory-layout.component.css',
})
export class MansoryLayoutComponent {
  @Input() photos: any;
  @Input() isUser: boolean = false;

  constructor(private router: Router) {}

  masonry: Masonry | null = null;
  onImageLoad(event: Event) {
    // If you use Masonry.js still
    if (this.masonry && typeof this.masonry.layout === 'function') {
      this.masonry.layout();
    }
  }

  photosDetails(photo: any) {
    alert('function call');
    this.router.navigate(['photo-details', photo.id], { state: { photo } });
  }
}
