import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyViewHomeComponent } from './my-view-home.component';

describe('MyViewHomeComponent', () => {
  let component: MyViewHomeComponent;
  let fixture: ComponentFixture<MyViewHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyViewHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyViewHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
