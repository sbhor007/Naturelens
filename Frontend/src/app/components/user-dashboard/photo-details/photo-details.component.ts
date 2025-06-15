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

@Component({
  selector: 'app-photo-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './photo-details.component.html',
  styleUrl: './photo-details.component.css',
})
export class PhotoDetailsComponent implements OnInit {
  photo: any = null;
  isLiked: boolean | null = null;
  totalLikes: any = null;
  comments: any | null = null;
  commentForm: FormGroup;
  updateCommentForm: FormGroup;
  username: string | null = null;
  isDisable = true;
  isReadonly = true;
  commentId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private likeService: LikeService,
    private commentService: CommentService,
    private authService: AuthService
  ) {
    // comment form
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
    // update comment form
    this.updateCommentForm = this.fb.group({
      message: ['', Validators.required],
    });

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
      const id = this.route.snapshot.paramMap.get('id');
      console.log('Photo ID from route params:', id);
      if (id) {
        // TODO: Implement photo fetching logic using the ID
        // this.fetchPhotoById(id);
        console.log('Need to fetch photo with ID:', id);
      } else {
        console.log('No photo data or ID found, redirecting to explore');
        this.router.navigate(['/explore']);
      }
    }

    console.log('Final photo details:', this.photo);

    this.commentService.getPhotoComments(this.photo.id);
    this.likeService.isLiked(this.photo.id);
    this.likeService.totalLikes(this.photo.id);
  }

  ngOnInit(): void {
    this.likeService.totalLikesState$.subscribe((res) => {
      this.totalLikes = res;
      console.log('total likes : ', this.totalLikes);
    });

    this.likeService.isLikedState$.subscribe((res) => {
      this.isLiked = res;
      console.log('is_liked: ', this.isLiked);
    });

    this.commentService.photoCommentState$.subscribe((res) => {
      this.comments = res.sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
    // Ensure the updateCommentForm control is disabled initially
    this.updateCommentForm.get('message')?.disable();
  }

  isLikeOrDislike(likeDetails: any) {
    this.likeService.likeOrDislike(likeDetails);
  }

  createComment(id: string) {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      alert('invalid');
      return;
    }

    const commentData = new FormData();
    commentData.append('photo', id);
    commentData.append('comment', this.commentForm.get('comment')?.value || '');
    this.commentService.createComment(commentData);
    this.commentForm.reset();
  }

  editComment(commentId: string, commentText?: string) {
    this.commentId = commentId;
    this.isDisable = !this.isDisable;
    this.isReadonly = !this.isReadonly;
    // Set the value of the update form to the comment's text
    this.updateCommentForm.get('message')?.setValue(commentText || '');
    // Enable or disable the control using the form API
    if (!this.isDisable) {
      this.updateCommentForm.get('message')?.enable();
    } else {
      this.updateCommentForm.get('message')?.disable();
    }
  }

  updateComment(commentId: any,photoId:any,userId:any) {
    console.log("hello");
    
    if(this.updateCommentForm.invalid){
      alert('invalid')
      return
    }
    const formData = new FormData()
    formData.append('photo',photoId)
    formData.append('user',userId)
    formData.append('comment',this.updateCommentForm.get('message')?.value || '')
    this.commentService.updateComment(formData,commentId)
    this.isDisable = !this.isDisable;
    this.isReadonly = !this.isReadonly;
  }

  deleteComment(commentId: string, photoId: string) {
    this.commentService.deleteComment(commentId, photoId);

  }
}
