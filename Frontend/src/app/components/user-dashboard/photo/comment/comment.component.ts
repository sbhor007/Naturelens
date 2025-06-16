import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../services/Auth/auth.service';
import { CommentService } from '../../../../services/social/comment/comment.service';

@Component({
  selector: 'app-comment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent implements OnInit {
  @Input() photoId: string | null = null;
  @Input() photoOwnerId: number | null = null;
  @Output() commentCount = new EventEmitter<number>();
  comments: any[] = [];
  username: string | null = null;
  isDisable = true;
  commentId: string = '';

  commentForm: FormGroup;
  updateCommentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private commentService: CommentService
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
   
  }

  fetchComments() {
    this.commentService.getPhotoComments(this.photoId!);
    this.commentService.photoCommentState$.subscribe((res) => {
      this.comments = res.sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      this.commentCount.emit(this.comments.length)
    });
    
  }


  ngOnInit(): void {
  this.updateCommentForm.get('message')?.disable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['photoId'] && this.photoId) {
      this.fetchComments();
    }
  }


  createComment(id: string) {
     console.log("COMPONENT: COMMENT: createComment : ",id);
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
    // this.isReadonly = !this.isReadonly;
    // Set the value of the update form to the comment's text
    this.updateCommentForm.get('message')?.setValue(commentText || '');
    // Enable or disable the control using the form API
    if (!this.isDisable) {
      this.updateCommentForm.get('message')?.enable();
    } else {
      this.updateCommentForm.get('message')?.disable();
    }
  }

  updateComment(commentId: any, photoId: any, userId: any) {
    console.log('hello');

    if (this.updateCommentForm.invalid) {
      alert('invalid');
      return;
    }
    const formData = new FormData();
    formData.append('photo', photoId);
    formData.append('user', userId);
    formData.append(
      'comment',
      this.updateCommentForm.get('message')?.value || ''
    );
    this.commentService.updateComment(formData, commentId);
    this.isDisable = !this.isDisable;
    // this.isReadonly = !this.isReadonly;
  }

  deleteComment(commentId: string, photoId: string) {
    this.commentService.deleteComment(commentId, photoId);
  }
}
