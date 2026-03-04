import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable()
export class iExpenseInterceptor implements HttpInterceptor {

  constructor( private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // console.log("Intercepting Requests")

     return next.handle(req)
     .pipe(
          retry(1),
          catchError((error) => {
            console.log(error, "Interceptor caught the error")
    
            if(error instanceof HttpErrorResponse){
              if (error.status === 401 || error.status === 440 || error.status === 500 || error.status === 403 || error.status === 0) { // 440 for session expired
    
                sessionStorage.setItem("auth", "false");
                this.router.navigate(['/login']);
              }
              if (error.status === 302) {
                console.log('Redirection error detected');
              }
            }
            return throwError(() => error);
          })
        )
  }
}
