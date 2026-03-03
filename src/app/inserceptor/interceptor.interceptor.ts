import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpError } from '../shared/services/indentdb.type';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {
auth;
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.auth = sessionStorage.getItem('token');
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth}`
      }
    });
    //return next.handle(request);
    return next.handle(request)
    .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          this.handleErrorStatus(error.status);
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) {
                // client-side error
                errorMessage = `Error: ${error.error.message}`;
                this.handleErrorStatus(error.status);
            } else {
                // server-side error
                errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
                this.handleErrorStatus(error.status);
                
            }
            return throwError(errorMessage);
        })
    )
  }

handleErrorStatus(errNo: number) {
  switch (errNo) {
    
    case HttpError.ServerError:
      this.popupErrorToast('The server is not responding. Please try again later');
      break;

    case HttpError.BadRequest:
        console.error('%c Bad Request 400');
        break;

    case HttpError.Unauthorized:
        console.error('%c Unauthorized 401 Tocken Expired'); // use to relogin 
        sessionStorage.clear()
        this.router.navigate(['']);
        break;

    case HttpError.NotFound:
        //show error toast message
        console.error('%c Not Found 404');
   
        // _router.navigate(['']);
        break;

    case HttpError.TimeOut:
        // Handled in AnalyticsExceptionHandler
        console.error('%c TimeOut 408');
        break;

    case HttpError.Forbidden:
        console.error('%c Forbidden 403');
        break;

    case HttpError.InternalServerError:
         this.popupErrorToast('The server is not responding. Please try again later');
        break;
}

}

popupErrorToast(message: String) {
  
  Swal.close();
  const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                  }
                })
          
                Toast.fire({
                  icon: 'error',
                  title: message
                }) 
}

}