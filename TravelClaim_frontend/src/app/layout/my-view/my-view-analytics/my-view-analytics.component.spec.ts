import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyViewAnalyticsComponent } from './my-view-analytics.component';

describe('MyViewAnalyticsComponent', () => {
  let component: MyViewAnalyticsComponent;
  let fixture: ComponentFixture<MyViewAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyViewAnalyticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyViewAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
