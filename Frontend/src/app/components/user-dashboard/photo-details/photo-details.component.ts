import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialService } from '../../../services/social/social.service';

@Component({
  selector: 'app-photo-details',
  imports: [],
  templateUrl: './photo-details.component.html',
  styleUrl: './photo-details.component.css',
})
export class PhotoDetailsComponent implements OnInit {
  photo: any = null;
  isLiked = false
  totalLikes:any = null

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socialService: SocialService
  ) {

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
    
    this.socialService.totalLikes(this.photo.id)
  }

  ngOnInit(): void {
    

    this.socialService.totalLikesState$.subscribe(
      res =>{
        this.totalLikes = res
        console.log('total likes : ', this.totalLikes);
      }
    )
    

    
  }

  isLikeOrDislike(likeDetails:any) {
    this.socialService.likeOrDislike(likeDetails)
  }
}


// TODO: Change User ID 