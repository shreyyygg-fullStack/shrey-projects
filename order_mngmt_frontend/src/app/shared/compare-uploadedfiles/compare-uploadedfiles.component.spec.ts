import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareUploadedfilesComponent } from './compare-uploadedfiles.component';

describe('CompareUploadedfilesComponent', () => {
  let component: CompareUploadedfilesComponent;
  let fixture: ComponentFixture<CompareUploadedfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareUploadedfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareUploadedfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
