import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  signal
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagesService } from '../../../services/images/images.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent implements OnInit {
  form: FormGroup;
  isDragOver = signal(false);
  imagePreview: string | ArrayBuffer | null = null;
  isImage = true;
  errorMessage: string | null = null;
  categories: any;
  tags: any;
  selectedFile: File | null = null;
  photosData: any;
  buttonName: string = 'Create Post';
  isCreateMode: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private imageService: ImagesService
  ) {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state?.['photo']) {
      this.photosData = navigation.extras.state['photo'];
      this.buttonName = 'Update Post';
      this.isCreateMode = false;
    } else if (history.state?.photo) {
      this.photosData = history.state.photo;
      this.buttonName = 'Update Post';
      this.isCreateMode = false;
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.fetchPhotoById(id);
        this.buttonName = 'Update Post';
        this.isCreateMode = false;
      }
    }

    // Build form without image required initially
    this.form = this.fb.group({
      image: [null],
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      category_name: ['', Validators.required],
      tag_names: ['', Validators.required],
    });

    if (this.photosData && this.photosData.id) {
      this.patchForm(this.photosData);
      this.imagePreview = this.photosData.image || null;
    }

    if (this.isCreateMode) {
      // In create mode, image is required
      this.form.get('image')?.addValidators(Validators.required);
    }

    this.imageService.getPhotoCategories();
    this.imageService.getTags();
  }

  ngOnInit(): void {
    this.imageService.photoCategoriesState$.subscribe((state) => {
      this.categories = state;
    });

    this.imageService.tagsState$.subscribe((state) => {
      this.tags = state;
    });
  }

  fetchPhotoById(id: string) {
    // TODO: implement actual fetch if needed
    // Example:
    // this.imageService.getPhotoById(id).subscribe(photo => {
    //   this.photosData = photo;
    //   this.patchForm(photo);
    //   this.imagePreview = photo.image || null;
    // });
  }

  patchForm(photo: any) {
    console.log('patch-image : ',photo.image|| null);
    // photo.image.replace('http://localhost:8000/media/mediafiles/',)
    this.form.patchValue({
      image:photo.image.replace('http://localhost:8000/media/mediafiles/','') || null,
      title: photo.title || '',
      description: photo.description || '',
      location: photo.location || '',
      category_name: photo.category?.name || '',
      tag_names: photo.tags ? photo.tags.map((t: any) => t.name).join(', ') : '',
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
      this.selectedFile = file;
    }
  }

  private validateAndSetFile(file: File) {
    this.errorMessage = null;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type === 'video/mp4';

    if (!isImage && !isVideo) {
      this.errorMessage = 'Only image or .mp4 video files are allowed.';
      return;
    }

    const maxSizeMB = isImage ? 20 : 200;
    if (file.size > maxSizeMB * 1024 * 1024) {
      this.errorMessage = `File size exceeds ${maxSizeMB}MB limit.`;
      return;
    }

    this.isImage = isImage;
    this.form.get('image')?.setValue(file);

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
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    formData.append('title', this.form.get('title')?.value || '');
    formData.append('description', this.form.get('description')?.value || '');
    formData.append('location', this.form.get('location')?.value || '');
    formData.append('category_name', this.form.get('category_name')?.value || '');

    const tags = this.form
      .get('tag_names')
      ?.value.split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag);

    formData.append('tag_names', JSON.stringify(tags || []));

    if (this.photosData && this.photosData.id) {
      console.log('update: ',formData);
      this.imageService.updatePhoto(formData,this.photosData.id)
      alert('update call')
      
    }else{
      console.log('update: ',formData);
      this.imageService.uploadPhotos(formData);
    }

    console.log('Form submitted:', formData);
  }

  resetForm() {
    this.form.reset();
    this.imagePreview = null;
    this.isImage = true;
    this.errorMessage = null;
  }
}
