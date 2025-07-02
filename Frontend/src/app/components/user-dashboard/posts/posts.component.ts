import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ImagesService } from '../../../services/images/images.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, NgModelGroup } from '@angular/forms';
import Masonry from 'masonry-layout';
import { Router } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-posts',
  imports: [CommonModule, ScrollingModule, NgxShimmerLoadingModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  userPosts: any[] = [];
  @ViewChild('masonryGrid') masonryGrid!: ElementRef;
  private msnry: any;
  private imageURL = environment.imagesURL;
  count:number = 0
 openMenuId: string | null = null;

  constructor(private router: Router, private imageService: ImagesService) {}

  ngOnInit(): void {
    this.imageService.hasGetUserPhotosCalled$.subscribe((res) => {
      console.log('this.imageService.hasGetUserPhotosCalled$ : ', res);
      if (!res) {
        this.imageService.getUserPhotos();
      }
    });

    this.imageService.userPhotosState$.subscribe((res) => {
      // this.count = res.count
      console.log("res:",res);
      this.userPosts = res.map((data:any) => ({
        ...data,
        image: this.imageURL + data.image
      }))
      setTimeout(() => {
        this.initMasonry();
      }, 0);
    });

    console.log('userPostState : ', this.userPosts);
  }

  openMenu(id: string) {
  this.openMenuId = this.openMenuId === id ? null : id;
}

  async ngAfterViewInit() {
    if (this.userPosts.length) {
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
          percentPosition: true,
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

  /* Delete Photo */
  deletePhoto(photoId:string){
    console.log("delete function call");
    if (confirm("Are You Shore"))
      this.imageService.deletePhoto(photoId)
    this.openMenuId = null;
  }

  /* update photo */
  updatePhoto(photo:any){
    if (photo && photo.id) {
      this.router.navigate(['user/update-post', photo.id], {
        state: { photo: photo },
      });
    } else {
      console.error('Photo object is missing an id:', photo);
    }
    this.openMenuId = null;
  }

}
