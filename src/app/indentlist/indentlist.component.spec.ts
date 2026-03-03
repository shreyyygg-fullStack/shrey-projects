import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentlistComponent } from './indentlist.component';

describe('IndentlistComponent', () => {
  let component: IndentlistComponent;
  let fixture: ComponentFixture<IndentlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndentlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
