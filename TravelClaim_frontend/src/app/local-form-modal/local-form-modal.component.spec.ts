import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalFormModalComponent } from './local-form-modal.component';

describe('LocalFormModalComponent', () => {
  let component: LocalFormModalComponent;
  let fixture: ComponentFixture<LocalFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalFormModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
