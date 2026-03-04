import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvRolesAndDepartmentsComponent } from './av-roles-and-departments.component';

describe('AvRolesAndDepartmentsComponent', () => {
  let component: AvRolesAndDepartmentsComponent;
  let fixture: ComponentFixture<AvRolesAndDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvRolesAndDepartmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvRolesAndDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
