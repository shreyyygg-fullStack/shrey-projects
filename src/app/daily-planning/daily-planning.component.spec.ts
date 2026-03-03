import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPlanningComponent } from './daily-planning.component';

describe('DailyPlanningComponent', () => {
  let component: DailyPlanningComponent;
  let fixture: ComponentFixture<DailyPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyPlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
