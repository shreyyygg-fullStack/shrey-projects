import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyViewApprovalsComponent } from './my-view-approvals.component';

describe('MyViewApprovalsComponent', () => {
  let component: MyViewApprovalsComponent;
  let fixture: ComponentFixture<MyViewApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyViewApprovalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyViewApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
