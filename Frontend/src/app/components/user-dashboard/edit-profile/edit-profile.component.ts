import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/User/user.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../../loading/loading.component";
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
  errorMessage: string | null = null;
  // profileData: any | null = null;
  isProfileAvailable: boolean = false;
  // isLoading: boolean = false;

  userProfileState$:Observable<UserProfileState>

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.profileForm = this.fb.group({
      profile_image: [null],
      bio: [''],
    });

    this.userProfileState$ = this.userService.userProfileState$
  }

  ngOnInit(): void {
    this.userProfileState$ = this.userService.userProfileState$

    this.userProfileState$.subscribe(
      state => {
        // this.isLoading = state.loading
        this.errorMessage = state.error
        // this.profileData = state.profile
        this.isProfileAvailable = state.available
        
        // TODO:my logic
        if(state.available){
          // this.profileData = state.profile
          console.log('profile data : ', state.profile);

          this.profileForm.patchValue({
            bio:state.profile.bio || '',
          })

          if(state.profile.profile_image){
            console.log('profile image:',state.profile.profile_image);
            
            this.imagePreview = 'https://res.cloudinary.com/dcyq171sr/' + state.profile.profile_image;
        this.isImage = true;
          }
        }
      }

    )
  }

  onFileSelected($event: Event) {
    const input = $event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.validateAndSetFile(file);
      console.log('selected file : ', this.selectedFile);
    }
  }

  private validateAndSetFile(file: File) {
    this.errorMessage = null;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type === 'video/mp4';
    if (!isImage && !isVideo) {
      this.errorMessage = 'Only image or .mp4 video files are allowed.';
      return;
    }

    // Validate file size
    const maxSizeMB = isImage ? 20 : 200; // 20MB for images, 200MB for videos
    if (file.size > maxSizeMB * 1024 * 1024) {
      this.errorMessage = `File size exceeds ${maxSizeMB}MB limit.`;
      return;
    }

    this.isImage = isImage;
    this.profileForm.patchValue({ profile_image: file });

    // Generate preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.onerror = () => {
      this.errorMessage = 'Error reading the file. Please try again.';
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return this.profileForm.markAllAsTouched();
    }

    if (this.profileForm.invalid) {
      return this.profileForm.markAllAsTouched();
    }

    const formData = new FormData();
    if (this.selectedFile) {
      console.log('is File selected');
      formData.append(
        'profile_image',
        this.selectedFile,
        this.selectedFile.name
      );
    }
    formData.append('bio', this.profileForm.get('bio')?.value || '');

    // PROPERLY LOG CONTENTS OF FormData
    // TODO:remove in future
    console.log('FormData content:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    this.userProfileState$.subscribe(
      state => {
        if (state.available) {
      this.updateProfile(formData);
    } else {
      this.createProfile(formData);
    }
      }
    )
  }
  //
  createProfile(formData: any) {
    this.userService.createProfile(formData)
  }
  //
  updateProfile(formData: any) {
    this.userProfileState$.subscribe(
      state =>{
        this.userService.updateProfile(formData,state.profile.id)    
      }
    )
  }
}
