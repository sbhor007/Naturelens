import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-post',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {

  form: FormGroup;
  isDragOver = signal(false);
  imagePreview: string | ArrayBuffer | null = null;
  isImage = true; // To differentiate between image and video
  errorMessage: string | null = null;

  boards = ['Photography', 'Design', 'Art', 'Technology'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      file: [null, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      link: ['', [Validators.pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)]],
      board: ['', Validators.required],
      tags: ['', Validators.required]
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
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
    this.form.patchValue({ file });

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
    if (this.form.valid) {
      const formData = {
        ...this.form.value,
        tags: this.form.value.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
      };
      alert('Post created successfully')
      console.log('Form submitted:', formData);
      // TODO:Add logic to send formData to a backend service
    }
  }

  resetForm() {
    this.form.reset();
    this.imagePreview = null;
    this.isImage = true;
    this.errorMessage = null;
  }
  
}
