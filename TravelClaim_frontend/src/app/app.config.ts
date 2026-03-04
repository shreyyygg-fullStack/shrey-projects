import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { iExpenseInterceptor } from './interceptor/i-expense.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideHttpClient(),
    provideHttpClient(withInterceptorsFromDi()), 
    {
      provide:HTTP_INTERCEPTORS,
      useClass:iExpenseInterceptor,
      multi:true
    }, 
    provideAnimations()
  ]
};
