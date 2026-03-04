import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverViewComponent } from './approver-view.component';

describe('ApproverViewComponent', () => {
  let component: ApproverViewComponent;
  let fixture: ComponentFixture<ApproverViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproverViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApproverViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
