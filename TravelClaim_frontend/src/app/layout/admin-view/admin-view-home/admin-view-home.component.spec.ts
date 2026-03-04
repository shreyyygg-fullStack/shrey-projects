import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewHomeComponent } from './admin-view-home.component';

describe('AdminViewHomeComponent', () => {
  let component: AdminViewHomeComponent;
  let fixture: ComponentFixture<AdminViewHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminViewHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
