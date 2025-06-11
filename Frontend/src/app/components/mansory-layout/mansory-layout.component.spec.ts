import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MansoryLayoutComponent } from './mansory-layout.component';

describe('MansoryLayoutComponent', () => {
  let component: MansoryLayoutComponent;
  let fixture: ComponentFixture<MansoryLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MansoryLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MansoryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
