import {HttpEvent,HttpHandlerFn,HttpInterceptorFn,HttpRequest} from '@angular/common/http';
import {Observable,throwError} from 'rxjs';
import {catchError,tap} from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  next(req).pipe(
    catchError(err => {
      console.error('Error intercepted: ', err);
      return throwError(() => new Error('Something went wrong!'));
    })
  );
  return next(req).pipe(
      tap(err => console.log('interceptor Error: ', err))
  );
}

