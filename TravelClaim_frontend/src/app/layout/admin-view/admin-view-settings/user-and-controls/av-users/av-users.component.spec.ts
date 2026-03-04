import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvUsersComponent } from './av-users.component';

describe('AvUsersComponent', () => {
  let component: AvUsersComponent;
  let fixture: ComponentFixture<AvUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
