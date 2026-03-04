import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvPolicyComponent } from './av-policy.component';

describe('AvPolicyComponent', () => {
  let component: AvPolicyComponent;
  let fixture: ComponentFixture<AvPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvPolicyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
