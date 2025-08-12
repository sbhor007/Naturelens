import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/User/user.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../loading/loading.component';
import { Observable } from 'rxjs';
import { UserProfileState } from '../../../model/models';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isImage = true;
  errorMessage: string | null | undefined = null;
  isProfileAvailable: boolean = false;

  userProfileState$: Observable<UserProfileState>;
  private latestProfileState: UserProfileState | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.profileForm = this.fb.group({
      profile_image: [null],
      bio: [''],
    });

    this.userProfileState$ = this.userService.userProfileState$;
  }

  ngOnInit(): void {
    this.userProfileState$ = this.userService.userProfileState$;

    this.userProfileState$.subscribe((state) => {
      this.latestProfileState = state;
    });

    this.errorMessage = this.latestProfileState?.error;
    this.isProfileAvailable = this.latestProfileState?.available ?? false;
    console.log('latest profile available : ', this.isProfileAvailable);
    console.log('latest profile state : ', this.latestProfileState);
    
    if (this.isProfileAvailable) {
      console.log('profile data : ', this.latestProfileState?.profile);

      this.profileForm.patchValue({
        bio: this.latestProfileState?.profile.bio || '',
      });

      if (this.latestProfileState?.profile.profile_image) {
        console.log('profile image:', this.latestProfileState?.profile.profile_image);
        this.imagePreview =
          'https://res.cloudinary.com/dcyq171sr/' +
          this.latestProfileState?.profile.profile_image;
        this.isImage = true;
      }
    }
  }

  onFileSelected($event: Event) {
    const input = $event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log('[File Selected]', file.name, 'size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      this.selectedFile = file;
      this.validateAndSetFile(file); // Validation + compression
    }
  }

  /**
   * VALIDATION + COMPRESSION (NEW LOGIC ADDED HERE)
   */
  private validateAndSetFile(file: File) {
    this.errorMessage = null;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type === 'video/mp4';
    console.log('[Validation] File type check -> isImage:', isImage, '| isVideo:', isVideo);

    if (!isImage && !isVideo) {
      this.errorMessage = 'Only image or .mp4 video files are allowed.';
      console.warn('[Validation Failed] Unsupported file type.');
      return;
    }

    const maxSizeMB = isImage ? 20 : 200;
    if (file.size > maxSizeMB * 1024 * 1024) {
      this.errorMessage = `File size exceeds ${maxSizeMB}MB limit.`;
      console.warn('[Validation Failed] File too large.');
      return;
    }

    this.isImage = isImage;

    // 🚀 NEW: Compress image if > 1MB
    if (isImage && file.size > 1 * 1024 * 1024) {
      console.log('[Compression] Starting compression for', file.name);
      this.compressImage(file, 0.7).then((compressedFile) => {
        console.log('[Compression] Finished. New size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
        this.selectedFile = compressedFile;
        this.profileForm.patchValue({ profile_image: compressedFile });
        this.generatePreview(compressedFile);
      }).catch(err => {
        console.error('[Compression Error]', err);
        this.selectedFile = file; // fallback to original
        this.profileForm.patchValue({ profile_image: file });
        this.generatePreview(file);
      });
    } else {
      console.log('[Validation] No compression needed.');
      this.selectedFile = file;
      this.profileForm.patchValue({ profile_image: file });
      this.generatePreview(file);
    }
  }

  /**
   * Generate Preview for Image
   */
  private generatePreview(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      console.log('[Preview] Image preview generated.');
    };
    reader.onerror = () => {
      this.errorMessage = 'Error reading the file. Please try again.';
      console.error('[Preview Error] Could not generate preview.');
    };
    reader.readAsDataURL(file);
  }

  /**
   * IMAGE COMPRESSION FUNCTION (NEW)
   * Uses <canvas> to resize & compress images.
   */
  private compressImage(file: File, quality: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          // Optional resizing for large images
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height = Math.round((height *= MAX_WIDTH / width));
              width = MAX_WIDTH;
            } else {
              width = Math.round((width *= MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                console.log('[Compression] Blob created.');
                resolve(new File([blob], file.name, { type: file.type }));
              } else {
                reject(new Error('Compression failed.'));
              }
            },
            file.type,
            quality
          );
        };
        img.onerror = () => reject(new Error('Image load error.'));
      };
      reader.onerror = (error) => reject(error);
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      console.warn('[Submit] Form invalid.');
      return this.profileForm.markAllAsTouched();
    }

    const formData = new FormData();
    if (this.selectedFile) {
      console.log('[Submit] Adding file to FormData:', this.selectedFile.name);
      formData.append('profile_image', this.selectedFile, this.selectedFile.name);
    }
    formData.append('bio', this.profileForm.get('bio')?.value || '');

    // Log FormData contents
    console.log('[Submit] FormData content:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    if (this.latestProfileState?.available) {
      console.log('[Profile] Updating existing profile...');
      this.isProfileAvailable = true;
      this.errorMessage = null;
      this.isImage = true; // Reset to default for new submission
      this.profileForm.markAsPristine();
      this.updateProfile(formData);
    } else {
      console.log('[Profile] Creating new profile...');
      this.isProfileAvailable = false;
      this.errorMessage = null;
      this.isImage = true; // Reset to default for new submission
      this.profileForm.markAsPristine();
      this.createProfile(formData);
    }
  }

  createProfile(formData: any) {
    console.log('[Profile] Creating new profile...');
    this.userService.createProfile(formData);
  }

  updateProfile(formData: any) {
    if (this.latestProfileState?.profile?.id) {
      console.log('[Profile] Updating existing profile...');
      this.userService.updateProfile(
        formData,
        this.latestProfileState.profile.id
      );
    }
  }
}
