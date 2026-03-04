import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvGlobalSettingsComponent } from './av-global-settings.component';

describe('AvGlobalSettingsComponent', () => {
  let component: AvGlobalSettingsComponent;
  let fixture: ComponentFixture<AvGlobalSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvGlobalSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvGlobalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
