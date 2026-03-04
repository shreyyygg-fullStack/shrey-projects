import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyViewTripsComponent } from './my-view-trips.component';

describe('MyViewTripsComponent', () => {
  let component: MyViewTripsComponent;
  let fixture: ComponentFixture<MyViewTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyViewTripsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyViewTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
