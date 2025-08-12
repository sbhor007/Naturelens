import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ImagesService } from '../../services/images/images.service';
import { Router } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { SavePhotoService } from '../../services/photos/savephotos/save-photo.service';
import { Subject, takeUntil, debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, ScrollingModule, NgxShimmerLoadingModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent implements OnInit, AfterViewInit, OnDestroy {
  images1: any[] = [];
  savedPhotoIds: string[] = [];
  savedPhotoObj: any;
  isLoading = false;
  totalImages: number = 0;

  private destroy$ = new Subject<void>();
  private animationTimeline?: gsap.core.Timeline;

  @ViewChildren('card') cards!: QueryList<ElementRef>;
  @ViewChild('scrollSentinel', { static: false }) scrollSentinel!: ElementRef;

  constructor(
    private imagesService: ImagesService,
    private router: Router,
    private savePhotoService: SavePhotoService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.initializeServices();
    this.setupScrollToTop();
  }

  ngAfterViewInit(): void {
    this.initializeAnimations();
    this.setupCardAnimationObserver();
    this.setupInfiniteScroll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    this.animationTimeline?.kill();
  }

  private initializeServices(): void {
    // Initialize photos service
    this.imagesService.hasGetPhotosCalled$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (!res) {
          this.imagesService.getAllPhotos();
        }
      });

    // Initialize saved photos service
    this.savePhotoService.hasGetSavedPhotosCalled$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (!res) {
          this.savePhotoService.getSavedPhotos();
        }
      });

    // Listen to photos updates
    this.imagesService.photosState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log('Photos state updated:', res); // Debug log
        if (res?.results) {
          this.totalImages = res?.count;

          // Create a map for existing images by id
          const existingImagesMap = new Map(this.images1.map((img) => [img.id, img]));

          // Merge new results, preserving isLoaded/hasError for existing images
          const mergedImages = res.results.map((img: any) => {
            const existing = existingImagesMap.get(img.id);
            return {
              ...img,
              isLoaded: existing ? existing.isLoaded : false,
              hasError: existing ? existing.hasError : false,
            };
          });

          this.images1 = mergedImages;

          console.log('Images array:', this.images1); // Debug log

          // Refresh ScrollTrigger after images update
          // CHANGE: small timeout tweak to allow image layout to settle before refresh
          setTimeout(() => {
            ScrollTrigger.refresh();
            this.cdr.detectChanges();
          }, 120);
        }
      });

    // Listen to saved photos updates
    this.savePhotoService.savedPhotoIdsState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.savedPhotoObj = res;
        this.savedPhotoIds = res.map((data: any) => data.photoId);
        this.cdr.detectChanges();
      });
  }

  private initializeAnimations(): void {
    gsap.registerPlugin(ScrollTrigger);

    // Set up master timeline
    this.animationTimeline = gsap.timeline();

    // Animate header on load (no functional change)
    gsap.from('.sticky', {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
    });
  }

  private setupCardAnimationObserver(): void {
    // Animate cards when they come into view
    this.cards.changes.pipe(takeUntil(this.destroy$)).subscribe((cards: QueryList<ElementRef>) => {
      this.animateCards(cards.toArray());
    });

    // Animate initial cards
    if (this.cards.length > 0) {
      this.animateCards(this.cards.toArray());
    }
  }

  private animateCards(cardElements: ElementRef[]): void {
    cardElements.forEach((card, index) => {
      // Kill existing triggers for this element
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === card.nativeElement) {
          trigger.kill();
        }
      });

      // Set initial state
      gsap.set(card.nativeElement, {
        opacity: 0,
        y: 90,
        scale: 0.9,
      });

      // CHANGE: Slightly increased stagger effect for more noticeable entrance
      gsap.to(card.nativeElement, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        delay: index * 0.03, // was 0.01 -> CHANGE: 0.03 for clearer staggering
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: card.nativeElement,
          start: 'top 90%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
          once: true,
        },
      });
    });

    // Refresh ScrollTrigger
    setTimeout(() => ScrollTrigger.refresh(), 60);
  }

  private setupInfiniteScroll(): void {
    if (this.scrollSentinel) {
      ScrollTrigger.create({
        trigger: this.scrollSentinel.nativeElement,
        start: 'top 95%',
        onEnter: () => {
          if (!this.isLoading) {
            console.log('Loading next photos...');
            this.loadNextPhotos();
          }
        },
      });
    }
  }

  private setupScrollToTop(): void {
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
      fromEvent(window, 'scroll')
        .pipe(debounceTime(100), takeUntil(this.destroy$))
        .subscribe(() => {
          // CHANGE: Lowered threshold so back-to-top feels more responsive on long lists
          const scrolled = window.pageYOffset > 180; // was 300
          gsap.to(backToTopButton, {
            opacity: scrolled ? 1 : 0,
            duration: 0.28,
            pointerEvents: scrolled ? 'auto' : 'none',
          });
        });

      fromEvent(backToTopButton, 'click')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          gsap.to(window, {
            duration: 1,
            // NOTE: this uses the scrollTo property — ensure ScrollToPlugin is available if used in your build
            scrollTo: { y: 0 },
            ease: 'power2.out',
          });
        });
    }
  }

  onImageLoad(event: Event, img: any): void {
    console.log('Image loaded successfully:', img.image); // Debug log
    img.isLoaded = true;
    img.hasError = false;

    // Add a subtle entrance animation for the loaded image
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      gsap.fromTo(
        imgElement,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 0.48, ease: 'power2.out' }
      );
    }

    this.cdr.detectChanges();
  }

  onImageError(event: Event, img: any): void {
    console.error('Failed to load image:', img.image); // Debug log
    img.hasError = true;
    img.isLoaded = true; // Hide shimmer even on error
    this.cdr.detectChanges();
  }

  loadNextPhotos(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    console.log('EXPLORE-COMPONENT:: loadNextPhotosCall');

    // Add loading animation to sentinel (subtle pulse)
    if (this.scrollSentinel) {
      gsap.to(this.scrollSentinel.nativeElement, {
        scale: 1.03,
        duration: 0.28,
        yoyo: true,
        repeat: 1,
      });
    }

    this.imagesService.loadNextPhotos();

    // Reset loading state after a delay (no core change)
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  photosDetails(photo: any): void {
    if (photo?.id) {
      // Add click animation (non-functional)
      const event = new CustomEvent('imageClick');

      this.router.navigate(['user/photo-details', photo.id], {
        state: { photo: photo },
      });
    } else {
      console.error('Photo object is missing an id:', photo);
    }
  }

  savePhoto(photoId: string): void {
    // NOTE: original code uses `event?.target` (global event). Keeping same behavior to avoid template changes.
    const button = (event as any)?.target as HTMLElement;

    if (button) {
      // Click bounce (existing)
      gsap.to(button, {
        scale: 1.2,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });

      // CHANGE: Micro success animation - subtle background flash to imply saved
      // This is purely visual; it does not affect saving logic.
      gsap.fromTo(
        button,
        { backgroundColor: '#ffffff' },
        { backgroundColor: '#bbf7d0', duration: 0.28, yoyo: true, repeat: 1 }
      );
    }

    // Core save action (unchanged)
    this.savePhotoService.savePhoto(photoId);
  }

  removeSavePhoto(photoId: string): void {
    // NOTE: original code uses `event?.target`. Keeping same pattern to avoid template changes.
    const button = (event as any)?.target as HTMLElement;

    if (button) {
      // Click bounce (existing)
      gsap.to(button, {
        scale: 1.2,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });

      // CHANGE: Smooth fade back to white so removing feels less abrupt
      gsap.to(button, { backgroundColor: '#ffffff', duration: 0.28 });
    }

    const removableObj = this.getSavedObject(photoId);
    // Keep same remove logic — unchanged
    this.savePhotoService.removeSavedPhoto(removableObj[0].objId, photoId);
  }

  getSavedObject(photoId: string): any[] {
    return this.savedPhotoObj.filter((data: any) => data.photoId === photoId);
  }

  trackByImageId(index: number, item: any): any {
    return item.id;
  }
}
