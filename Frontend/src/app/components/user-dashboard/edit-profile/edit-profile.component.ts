import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/User/user.service';
import { eventNames } from 'process';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {

  profileForm: FormGroup
  selectedFile:File | null = null
  imagePreview:string | ArrayBuffer | null = null
  isImage = true
  errorMessage:string | null = null



  constructor(private fb: FormBuilder,
    private userService:UserService
  ){
    this.profileForm = this.fb.group({
      profile_image:[null],
      bio:['']
    })

     
  }


  onFileSelected($event: Event) {
    const input = event?.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.validateAndSetFile(file);
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
    this.profileForm.patchValue({ file });

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

  createProfile(){
    if(this.profileForm.invalid){
      return this.profileForm.markAllAsTouched()
    }
    
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('profile_image', this.selectedFile, this.selectedFile.name);
    }
    formData.append('bio', this.profileForm.get('bio')?.value || '');

    console.log('profile credentials : ',formData);
    
    this.userService.createProfile(formData).subscribe({
      next: res =>{
        alert('user profile created')
        console.log(res);
        
      },
      error: err =>{
        alert('something went wrong')
        console.log(err);
        
      }
    })
  }
}
