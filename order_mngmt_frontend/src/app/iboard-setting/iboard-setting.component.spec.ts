import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IboardSettingComponent } from './iboard-setting.component';

describe('IboardSettingComponent', () => {
  let component: IboardSettingComponent;
  let fixture: ComponentFixture<IboardSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IboardSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IboardSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
