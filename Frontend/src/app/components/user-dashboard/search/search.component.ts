import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../services/search/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private searchService: SearchService,
    private router:Router
  ){
    this.searchForm = this.fb.group({
      searchTerm: ['', Validators.required],
    });
  }

  search() {
    console.log("function Call");
    
    if(this.searchForm.invalid){
      this.router.navigate(['user/'])
      return this.searchForm.markAllAsTouched()
    }
    const searchTerm = this.searchForm.get('searchTerm')?.value
    console.log("searchTerm : ",searchTerm);
    this.searchService.searchPhotos(searchTerm)
  }
}
