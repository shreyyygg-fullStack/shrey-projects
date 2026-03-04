import { TestBed } from '@angular/core/testing';

import { UiTourService } from './ui-tour.service';

describe('UiTourService', () => {
  let service: UiTourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiTourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
