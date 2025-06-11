import { Component, OnInit } from '@angular/core';
import { ImagesService } from '../../../services/images/images.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, NgModelGroup } from '@angular/forms';
import Masonry from 'masonry-layout';
import { MansoryLayoutComponent } from "../../mansory-layout/mansory-layout.component";

@Component({
  selector: 'app-posts',
  imports: [CommonModule, MansoryLayoutComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {

  userPosts:any

  constructor(private imageService:ImagesService){
    this.imageService.getUserPhotos()
  }

  ngOnInit(): void {
      this.imageService.userPhotosState$.subscribe(
        state => {
          this.userPosts = state
        }
      )

      console.log('userPostState : ',this.userPosts);   
  }

  masonry: Masonry | null = null;
    onImageLoad(event: Event) {
      // If you use Masonry.js still
      if (this.masonry && typeof this.masonry.layout === 'function') {
        this.masonry.layout();
      }
    }



}
