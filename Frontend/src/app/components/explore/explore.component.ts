import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  ViewChild,
} from "@angular/core";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ImagesService } from "../../services/images/images.service";
import { Router } from "@angular/router";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgxShimmerLoadingModule } from "ngx-shimmer-loading";
import { SavePhotoService } from "../../services/photos/savephotos/save-photo.service";

@Component({
  selector: "app-explore",
  standalone: true,
  imports: [CommonModule, ScrollingModule, NgxShimmerLoadingModule],
  templateUrl: "./explore.component.html",
  styleUrl: "./explore.component.css",
})
export class ExploreComponent implements OnInit {
  images1: any = [];
  savedPhotoIds: string[] = [];
  savedPhotoObj: any;

  @ViewChildren("card") cards!: QueryList<ElementRef>;
  @ViewChild("scrollSentinel", { static: false }) scrollSentinel!: ElementRef;

  constructor(
    private imagesService: ImagesService,
    private router: Router,
    private savePhotoService: SavePhotoService,
  ) {}

  ngOnInit(): void {
    this.imagesService.hasGetPhotosCalled$.subscribe((res) => {
      if (!res) {
        this.imagesService.getAllPhotos();
      }
    });

    this.savePhotoService.hasGetSavedPhotosCalled$.subscribe((res) => {
      if (!res) {
        this.savePhotoService.getSavedPhotos();
      }
    });

    this.imagesService.photosState$.subscribe((res) => {
      this.images1 = res?.results?.map((img: any) => ({
        ...img,
        isLoaded: false,
      }));

      // Recalculate triggers when new images load
      setTimeout(() => ScrollTrigger.refresh(), 100);
    });

    this.savePhotoService.savedPhotoIdsState$.subscribe((res) => {
      this.savedPhotoObj = res;
      this.savedPhotoIds = res.map((data: any) => data.photoId);
    });
  }

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);

    // Animate new cards
    this.cards.changes.subscribe((cards: QueryList<ElementRef>) => {
      cards.forEach((card, i) => {
        gsap.from(card.nativeElement, {
          opacity: 0,
          y: 50,
          duration: 0.5,
          delay: i * 0.01,
          scrollTrigger: {
            trigger: card.nativeElement,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
      ScrollTrigger.refresh();
    });

    // Animate initially rendered cards
    this.cards.forEach((card, i) => {
      gsap.from(card.nativeElement, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        delay: i * 0.01,
        scrollTrigger: {
          trigger: card.nativeElement,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    // Trigger infinite scroll when sentinel enters view
    ScrollTrigger.create({
      trigger: this.scrollSentinel.nativeElement,
      start: "top 90%",
      onEnter: () => {
        console.log("Sentinel reached. Loading next photos...");
        this.loadNextPhotos();
      },
    });
  }

  onImageLoad(event: Event, img: any) {
    img.isLoaded = true;
  }

  loadNextPhotos() {
    console.log("EXPLORE-COMPONENT:: loadNextPhotosCall");

    this.imagesService.loadNextPhotos();
  }

  photosDetails(photo: any) {
    if (photo && photo.id) {
      this.router.navigate(["user/photo-details", photo.id], {
        state: { photo: photo },
      });
    } else {
      console.error("Photo object is missing an id:", photo);
    }
  }

  savePhoto(photoId: string) {
    this.savePhotoService.savePhoto(photoId);
  }

  removeSavePhoto(photoId: string) {
    const removableObj = this.getSavedObject(photoId);
    this.savePhotoService.removeSavedPhoto(removableObj[0].objId, photoId);
  }

  getSavedObject(photoId: string) {
    return this.savedPhotoObj.filter((data: any) => data.photoId == photoId);
  }
}
