import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LikeService } from '../../../services/social/like/like.service';
import { CommentService } from '../../../services/social/comment/comment.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/Auth/auth.service';
import { CommentComponent } from '../photo/comment/comment.component';
import { SavePhotoService } from '../../../services/photos/savephotos/save-photo.service';
import { ImagesService } from '../../../services/images/images.service';

@Component({
  selector: 'app-photo-details',
  imports: [CommonModule, ReactiveFormsModule, CommentComponent],
  templateUrl: './photo-details.component.html',
  styleUrl: './photo-details.component.css',
})
export class PhotoDetailsComponent implements OnInit {
  photo: any = null;
  isLiked: boolean | null = null;
  totalLikes: number | null = 0;
  totalComments: number = 0;
  username: string | null = null;
  savedPhotoObj: any[] = [];
  savedPhotoIds: any[] = [];

  totalSavedPhotoCount:number = 0

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private likeService: LikeService,
    private authService: AuthService,
    private savePhotoService: SavePhotoService,
    private imageService: ImagesService,
  ) {
    this.username = authService.getUsername();
    const navigation = this.router.getCurrentNavigation();

    // Check if we have state data from navigation
    if (navigation?.extras.state && navigation.extras.state['photo']) {
      this.photo = navigation.extras.state['photo'];
      console.log('Photo from navigation state:', this.photo);
    }
    // Fallback: Check if state exists in router's current state
    else if (history.state && history.state.photo) {
      this.photo = history.state.photo;
      console.log('Photo from history state:', this.photo);
    }
    // Final fallback: Get ID from route params
    else {
      const photoId = this.route.snapshot.paramMap.get('id');
      console.log('Photo ID from route params:', photoId);
      if (photoId) {
        this.getPhotoById(photoId);
        console.log('Need to fetch photo with ID:', photoId);
      } else {
        console.log('No photo data or ID found, redirecting to explore');
        this.router.navigate(['/explore']);
      }
    }

    console.log('Final photo details:', this.photo);
    



    if (this.photo) {
      this.likeService.isLiked(this.photo.id);
      this.likeService.totalLikes(this.photo.id);
      this.savePhotoService.totalSavedPhotos(this.photo.id)
    }

    this.likeService.totalLikesState$.subscribe((res) => {
      this.totalLikes = res;
    });

    this.likeService.isLikedState$.subscribe((res) => {
      this.isLiked = res;
    });

    this.likeService.isLikedState$.subscribe((res) => {
      this.isLiked = res;
      console.log('is_liked: ', this.isLiked);
    });

    this,savePhotoService.totalSavedPhotoState$.subscribe(
      res =>{
        this.totalSavedPhotoCount = res
        console.log('totalsave:',this.totalSavedPhotoCount);
        
      }
    )
  }

  ngOnInit(): void {
    this.savePhotoService.totalSavedPhotos(this.photo.id)
    this.savePhotoService.savedPhotoIdsState$.subscribe((res) => {
      this.savedPhotoObj = res;
      this.savedPhotoIds = res.map((data: any) => data.photoId);
    });
    console.log('---',this.getSavedObject(this.photo.id));
    
  }

  isLikeOrDislike(likeDetails: any) {
    this.likeService.likeOrDislike(likeDetails);
  }

  onCommentCountChange(count: number) {
    this.totalComments = count;
  }

  savePhoto(photoId:string){
    this.savePhotoService.savePhoto(photoId)
  }

  removeSavePhoto(photoId:string){
    const removableObj = this.savedPhotoObj.filter((data:any) => data.photoId == photoId)
    console.log('removePhoto : ',removableObj);
    this.savePhotoService.removeSavedPhoto(removableObj[0].objId,photoId)
  }

  getSavedObject(photoId:string){
    return this.savedPhotoObj.filter((data:any) => data.photoId == photoId)
  }

  // Get Photo by ID
  getPhotoById(photoId: string) {
    this.imageService.getPhotoById(photoId).subscribe({
      next: (res) => {
        this.photo = res;
        console.log('Photo details:', this.photo);   
      },
      error: (err) => {
        console.error('Error fetching photo:', err);
      },
    });  
  }
}
