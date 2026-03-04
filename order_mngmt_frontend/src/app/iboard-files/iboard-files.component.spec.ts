import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IboardFilesComponent } from './iboard-files.component';

describe('IboardFilesComponent', () => {
  let component: IboardFilesComponent;
  let fixture: ComponentFixture<IboardFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IboardFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IboardFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
