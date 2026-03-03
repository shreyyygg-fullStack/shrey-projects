import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EMailSettingComponent } from './e-mail-setting.component';

describe('EMailSettingComponent', () => {
  let component: EMailSettingComponent;
  let fixture: ComponentFixture<EMailSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EMailSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EMailSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
