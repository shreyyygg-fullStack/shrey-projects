import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvEmailSettingComponent } from './inv-email-setting.component';

describe('InvEmailSettingComponent', () => {
  let component: InvEmailSettingComponent;
  let fixture: ComponentFixture<InvEmailSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvEmailSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvEmailSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
