import { TestBed } from '@angular/core/testing';

import { PdfFileService } from './pdf-file.service';

describe('PdfFileService', () => {
  let service: PdfFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
