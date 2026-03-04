import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewSettingsComponent } from './admin-view-settings.component';

describe('AdminViewSettingsComponent', () => {
  let component: AdminViewSettingsComponent;
  let fixture: ComponentFixture<AdminViewSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminViewSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
