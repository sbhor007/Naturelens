import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataQueue } from '../inserDomyData';
import { ImagesService } from '../services/images/images.service';

@Component({
  selector: "app-domy-image-insert",
  imports: [ReactiveFormsModule],
  templateUrl: "./domy-image-insert.component.html",
  styleUrl: "./domy-image-insert.component.css",
})
export class DomyImageInsertComponent {
  photoForm: FormGroup;
  dataQueue = [...DataQueue]; // clone to avoid mutating original
  imagesArray: File[] = [];

  constructor(
    private fb: FormBuilder,
    private imageService: ImagesService
  ) {
    this.photoForm = this.fb.group({
      title: [""],
      description: [""],
      category_name: [""],
      tags: [""],
      location: [""],
    });
  }

  ngOnInit(): void {
    this.loadNextEntry();
  }

  loadNextEntry(): void {
    if (this.dataQueue.length > 0) {
      const next = this.dataQueue[0];
      this.photoForm.patchValue({
        title: next.title,
        description: next.description,
        category_name: next.category_name,
        tags: next.tags,
        location: next.location,
      });
    } else {
      console.log("✅ All data entries processed");
      this.photoForm.reset();
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagesArray = Array.from(input.files).filter(file => file.type.startsWith('image/'));
      console.log('Selected images:', this.imagesArray);
    } else {
      console.warn("No files selected.");
    }
  }

  submit(): void {
    if (this.imagesArray.length === 0) {
      console.warn("⚠️ No images to upload.");
      return;
    }
    if (this.dataQueue.length === 0) {
      console.warn("⚠️ No data entries to process.");
      return;
    }

    // Loop through matching pairs
    const count = Math.min(this.imagesArray.length, this.dataQueue.length);
    for (let i = 0; i < count; i++) {
      this.uploadImageWithData(this.imagesArray[i], this.dataQueue[i], i);
    }
  }

  uploadImageWithData(image: File, data: any, index: number): void {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category_name", data.category_name);
    formData.append("tag_names", data.tags);
    formData.append("location", data.location);
    formData.append("image", image);


    try {
      this.imageService.uploadPhotos(formData)
      console.log('✅ Uploaded successfully:');
        // this.imagesArray.shift(); // remove uploaded image
        // this.dataQueue.shift();   // remove processed data
        // this.loadNextEntry();     // loa
    } catch (error) {
      console.error('❌ Upload failed:', error);
    }

    // this.imageService.uploadPhotos(formData).subscribe({
    //   next: (res) => {
    //     console.log('✅ Uploaded successfully:', res);
    //     this.imagesArray.shift(); // remove uploaded image
    //     this.dataQueue.shift();   // remove processed data
    //     this.loadNextEntry();     // load next data entry
    //   },
    //   error: (err) => {
    //     console.error('❌ Upload failed:', err);
    //   }
    // });
  }
}
