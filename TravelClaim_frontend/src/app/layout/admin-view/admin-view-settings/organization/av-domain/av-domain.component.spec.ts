import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvDomainComponent } from './av-domain.component';

describe('AvDomainComponent', () => {
  let component: AvDomainComponent;
  let fixture: ComponentFixture<AvDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvDomainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
