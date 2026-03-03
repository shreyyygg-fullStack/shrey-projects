import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentmgmtComponent } from './indentmgmt.component';

describe('IndentmgmtComponent', () => {
  let component: IndentmgmtComponent;
  let fixture: ComponentFixture<IndentmgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndentmgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndentmgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
