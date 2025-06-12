import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import gsap from 'gsap';
import { ImagesService } from '../../services/images/images.service';
import Masonry from 'masonry-layout';
import { Router } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling'; // Import ScrollingModule
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule,ScrollingModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent implements OnInit {
  images = [
    {
      src: 'https://images.pexels.com/photos/31464235/pexels-photo-31464235/free-photo-of-romantic-flamingos-displaying-heart-shaped-pose.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'Beautiful Landscape',
      description: 'Some description about this image or card content.',
    },
    {
      src: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Mountain Range',
      description: 'Snow-covered peaks reaching into the sky.',
    },
    {
      src: 'https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
      title: 'Forest Trail',
      description: 'A calm path through dense, green trees.',
    },
    {
      src: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Desert Dunes',
      description: 'Golden sand waves under a blue sky.',
    },
    {
      src: 'https://images.pexels.com/photos/35600/road-sun-rays-path.jpg?auto=compress&cs=tinysrgb&w=800',
      title: 'Sunset Road',
      description: 'A road vanishing into a glowing sunset.',
    },
    {
      src: 'https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'City Lights',
      description: 'Night view of a bustling modern city.',
    },
    {
      src: 'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Lavender Fields',
      description: 'Purple blooms stretching to the horizon.',
    },
    {
      src: 'https://images.pexels.com/photos/349758/pexels-photo-349758.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Snowy Cabin',
      description: 'A quiet cabin nestled in the winter woods.',
    },
    {
      src: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
      title: 'Ocean Breeze',
      description: 'Gentle waves lapping a white sand beach.',
    },
    {
      src: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Autumn Park',
      description: 'Fallen leaves and warm orange colors.',
    },
    {
      src: 'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=800',
      title: 'Wild Horses',
      description: 'Horses running free across open plains.',
    },
    {
      src: 'https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Classic Lighthouse',
      description: 'A lighthouse overlooking stormy seas.',
    },
    {
      src: 'https://images.pexels.com/photos/158607/cairn-fog-mystical-background-158607.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Misty Mountains',
      description: 'Low clouds shrouding majestic peaks.',
    },
    {
      src: 'https://images.pexels.com/photos/234608/pexels-photo-234608.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Hot Air Balloons',
      description: 'Colorful balloons floating at sunrise.',
    },
    {
      src: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Rainy Window',
      description: 'Raindrops on glass during a grey day.',
    },
    {
      src: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Sleepy Cat',
      description: 'A kitten curled up on a cozy blanket.',
    },
    {
      src: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Rustic Barn',
      description: 'An old barn surrounded by golden fields.',
    },
    {
      src: 'https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Blooming Sakura',
      description: 'Cherry blossoms in full bloom.',
    },
    {
      src: 'https://images.pexels.com/photos/1146709/pexels-photo-1146709.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Cliffside View',
      description: 'Waves crashing against a steep cliff.',
    },
    {
      src: 'https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Lake Reflection',
      description: 'Mountains mirrored in still water.',
    },
    {
      src: 'https://images.pexels.com/photos/1533720/pexels-photo-1533720.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Vintage Car',
      description: 'A classic car parked in front of a diner.',
    },
    {
      src: 'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Starry Night',
      description: 'The Milky Way stretching across the sky.',
    },
    {
      src: 'https://images.pexels.com/photos/290470/pexels-photo-290470.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Golden Hour',
      description: 'Sunlight painting the fields golden.',
    },
    {
      src: 'https://images.pexels.com/photos/207983/pexels-photo-207983.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Street Market',
      description: 'Colorful stalls with fresh produce.',
    },
    {
      src: 'https://images.pexels.com/photos/242246/pexels-photo-242246.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Foggy Forest',
      description: 'Mysterious vibes among the tall trees.',
    },
    {
      src: 'https://images.pexels.com/photos/1037993/pexels-photo-1037993.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Coastal Road',
      description: 'A scenic drive along the ocean.',
    },
    {
      src: 'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Morning Coffee',
      description: 'A cozy cup to start the day.',
    },
    {
      src: 'https://images.pexels.com/photos/1574843/pexels-photo-1574843.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Alpine Village',
      description: 'Small town under towering peaks.',
    },
    {
      src: 'https://images.pexels.com/photos/302804/pexels-photo-302804.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Bridge Over River',
      description: 'Peaceful water flowing under an old bridge.',
    },
    {
      src: 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Colorful Parrot',
      description: 'A tropical bird perched on a branch.',
    },
    {
      src: 'https://images.pexels.com/photos/302743/pexels-photo-302743.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Vintage Typewriter',
      description: 'Old-school charm and tactile keys.',
    },
    {
      src: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Mountain Range',
      description: 'Snow-covered peaks reaching into the sky.',
    },
    {
      src: 'https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
      title: 'Forest Trail',
      description: 'A calm path through dense, green trees.',
    },
    {
      src: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Desert Dunes',
      description: 'Golden sand waves under a blue sky.',
    },
    {
      src: 'https://images.pexels.com/photos/35600/road-sun-rays-path.jpg?auto=compress&cs=tinysrgb&w=800',
      title: 'Sunset Road',
      description: 'A road vanishing into a glowing sunset.',
    },
    {
      src: 'https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'City Lights',
      description: 'Night view of a bustling modern city.',
    },
    {
      src: 'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Lavender Fields',
      description: 'Purple blooms stretching to the horizon.',
    },
    {
      src: 'https://images.pexels.com/photos/349758/pexels-photo-349758.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Snowy Cabin',
      description: 'A quiet cabin nestled in the winter woods.',
    },
    {
      src: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
      title: 'Ocean Breeze',
      description: 'Gentle waves lapping a white sand beach.',
    },
    {
      src: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Autumn Park',
      description: 'Fallen leaves and warm orange colors.',
    },
    {
      src: 'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=800',
      title: 'Wild Horses',
      description: 'Horses running free across open plains.',
    },
    {
      src: 'https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Classic Lighthouse',
      description: 'A lighthouse overlooking stormy seas.',
    },
    {
      src: 'https://images.pexels.com/photos/158607/cairn-fog-mystical-background-158607.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Misty Mountains',
      description: 'Low clouds shrouding majestic peaks.',
    },
    {
      src: 'https://images.pexels.com/photos/234608/pexels-photo-234608.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Hot Air Balloons',
      description: 'Colorful balloons floating at sunrise.',
    },
    {
      src: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Rainy Window',
      description: 'Raindrops on glass during a grey day.',
    },
    {
      src: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Sleepy Cat',
      description: 'A kitten curled up on a cozy blanket.',
    },
    {
      src: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Rustic Barn',
      description: 'An old barn surrounded by golden fields.',
    },
    {
      src: 'https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Blooming Sakura',
      description: 'Cherry blossoms in full bloom.',
    },
    {
      src: 'https://images.pexels.com/photos/1146709/pexels-photo-1146709.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Cliffside View',
      description: 'Waves crashing against a steep cliff.',
    },
    {
      src: 'https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Lake Reflection',
      description: 'Mountains mirrored in still water.',
    },
    {
      src: 'https://images.pexels.com/photos/1533720/pexels-photo-1533720.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Vintage Car',
      description: 'A classic car parked in front of a diner.',
    },
    {
      src: 'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Starry Night',
      description: 'The Milky Way stretching across the sky.',
    },
    {
      src: 'https://images.pexels.com/photos/290470/pexels-photo-290470.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Golden Hour',
      description: 'Sunlight painting the fields golden.',
    },
    {
      src: 'https://images.pexels.com/photos/207983/pexels-photo-207983.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Street Market',
      description: 'Colorful stalls with fresh produce.',
    },
  ];
  images1: any | null;

  constructor(private imagesService: ImagesService, private router: Router) {
    this.imagesService.getAllPhotos();
  }
  ngOnInit(): void {
    // this.imagesService.getAllPhotos();
    // this.imagesService.getPhotoCategories()
    // this.imagesService.getTags()
    this.imagesService.photosState$.subscribe((state) => {
      this.images1 = state;
    });
    console.log(this.images1);
  }

  @ViewChildren('card') cards!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.cards.forEach((card, i) => {
      gsap.from(card.nativeElement, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1,
        scrollTrigger: {
          trigger: card.nativeElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  masonry: Masonry | null = null;
  onImageLoad(event: Event) {
    // If you use Masonry.js still
    if (this.masonry && typeof this.masonry.layout === 'function') {
      this.masonry.layout();
    }
  }

  photosDetails(photo: any) {
    console.log('photo :', photo);
    console.log('function call');
    if (photo && photo.id) {
      this.router.navigate(['user/photo-details', photo.id], { state: { photo:photo } });
    } else {
      console.error('Photo object is missing an id:', photo);
    }
  }
}
