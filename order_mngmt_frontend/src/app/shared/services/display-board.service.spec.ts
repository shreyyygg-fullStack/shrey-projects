import { TestBed } from '@angular/core/testing';

import { DisplayBoardService } from './display-board.service';

describe('DisplayBoardService', () => {
  let service: DisplayBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
