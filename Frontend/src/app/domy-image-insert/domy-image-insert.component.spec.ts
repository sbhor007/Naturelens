import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomyImageInsertComponent } from './domy-image-insert.component';

describe('DomyImageInsertComponent', () => {
  let component: DomyImageInsertComponent;
  let fixture: ComponentFixture<DomyImageInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomyImageInsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomyImageInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
