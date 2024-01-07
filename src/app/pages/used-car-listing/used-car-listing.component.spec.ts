import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedCarListingComponent } from './used-car-listing.component';

describe('UsedCarListingComponent', () => {
  let component: UsedCarListingComponent;
  let fixture: ComponentFixture<UsedCarListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsedCarListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsedCarListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
