import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyCashModalComponent } from './petty-cash-modal.component';

describe('PettyCashModalComponent', () => {
  let component: PettyCashModalComponent;
  let fixture: ComponentFixture<PettyCashModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCashModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PettyCashModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
