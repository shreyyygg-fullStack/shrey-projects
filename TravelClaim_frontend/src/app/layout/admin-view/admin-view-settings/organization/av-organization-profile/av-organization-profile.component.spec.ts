import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvOrganizationProfileComponent } from './av-organization-profile.component';

describe('AvOrganizationProfileComponent', () => {
  let component: AvOrganizationProfileComponent;
  let fixture: ComponentFixture<AvOrganizationProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvOrganizationProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvOrganizationProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
