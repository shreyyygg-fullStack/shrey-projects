import { TestBed } from '@angular/core/testing';
import { iExpenseInterceptor } from './i-expense.interceptor';

describe('iExpenseInterceptor', () => {
  beforeEach(() => 
    TestBed.configureTestingModule({
      providers: [
        iExpenseInterceptor
        ]
    }));

  it('should be created', () => {
    const interceptor: iExpenseInterceptor = TestBed.inject(iExpenseInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
