import { TestBed } from '@angular/core/testing';

import { SavePhotoService } from './save-photo.service';

describe('SavePhotoService', () => {
  let service: SavePhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavePhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
