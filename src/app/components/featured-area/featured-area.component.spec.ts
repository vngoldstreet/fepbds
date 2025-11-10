import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedAreaComponent } from './featured-area.component';

describe('FeaturedAreaComponent', () => {
  let component: FeaturedAreaComponent;
  let fixture: ComponentFixture<FeaturedAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
