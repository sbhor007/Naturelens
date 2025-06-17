import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { LikeService } from '../../../../services/social/like/like.service';
import { AuthService } from '../../../../services/Auth/auth.service';

@Component({
  selector: 'app-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  @Input() photo: any;

  isLiked: boolean | null = null;
  totalLikes: number | null = 0;
  totalComments: number = 0;

  username: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private likeService: LikeService,
    private authService: AuthService
  ) {
    this.username = authService.getUsername();

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
  }

  isLikeOrDislike(likeDetails: any) {
    this.likeService.likeOrDislike(likeDetails);
  }
}
