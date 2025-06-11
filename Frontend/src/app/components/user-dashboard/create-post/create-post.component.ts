import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { routes } from '../../../app.routes';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ImagesService } from '../../../services/images/images.service';
import { table } from 'console';

@Component({
  selector: 'app-create-post',
  imports: [CommonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent implements OnInit {
  removeFile($event: MouseEvent) {
    throw new Error('Method not implemented.');
  }

  form: FormGroup;
  isDragOver = signal(false);
  imagePreview: string | ArrayBuffer | null = null;
  isImage = true; // To differentiate between image and video
  errorMessage: string | null = null;
  categories: any;
  tags: any;
  selectedFile: File | null = null;
  photosData:any

  boards = ['Photography', 'Design', 'Art', 'Technology'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private imageService: ImagesService
  ) {
    this.form = this.fb.group({
      image: [null, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],

      category_name: ['', Validators.required],
      tag_names: ['', Validators.required],
    });
    this.imageService.getAllPhotos()
    this.imageService.getPhotoCategories();
    this.imageService.getTags();
  }

  ngOnInit(): void {
    this.imageService.photosState$.subscribe(
      state => {
        this.photosData = state
      }
    )
    this.imageService.photoCategoriesState$.subscribe((state) => {
      this.categories = state;
    });

    this.imageService.tagsState$.subscribe((state) => {
      this.tags = state;
    });

    console.log('Photos Data:', this.photosData);
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
      this.selectedFile = file;
      this.validateAndSetFile(file);
      console.log('elected file : ', this.selectedFile);
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
    this.form.patchValue({ image: file });

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
    
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }

    const formData = new FormData();
    if (this.selectedFile) {
      console.log('file selected');
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
    formData.append('title', this.form.get('title')?.value || '');
    formData.append('description', this.form.get('description')?.value || '');
    formData.append('location', this.form.get('location')?.value || '');
    formData.append(
      'category_name',
      this.form.get('category_name')?.value || ''
    );
    const tags = this.form
        .get('tag_names')
        ?.value.split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag)

    formData.append(
      'tag_names',
      tags
    );
console.log('tags:',tags);

    this.imageService.uploadPhotos(formData)
    console.log("create post",formData);
    
  }

  resetForm() {
    this.form.reset();
    this.imagePreview = null;
    this.isImage = true;
    this.errorMessage = null;
  }
}
