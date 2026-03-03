import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentDetailViewComponent } from './indent-detail-view.component';

describe('IndentDetailViewComponent', () => {
  let component: IndentDetailViewComponent;
  let fixture: ComponentFixture<IndentDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndentDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndentDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
