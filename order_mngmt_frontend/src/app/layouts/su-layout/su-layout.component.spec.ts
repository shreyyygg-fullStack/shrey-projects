import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuLayoutComponent } from './su-layout.component';

describe('SuLayoutComponent', () => {
  let component: SuLayoutComponent;
  let fixture: ComponentFixture<SuLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
