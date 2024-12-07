import {HttpInterceptorFn,HttpRequest} from '@angular/common/http';
import {tap} from 'rxjs';

// Function Interceptor, rather than a class-based interceptor
export const httpRequestInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next) => {
  if (req.url.startsWith('https://jsonplaceholder.typicode.com/users')) {
      // Setting a dummy token for demonstration
      const headers = req.headers.set('Authorization', 'Bearer Auth-11223344');

      req = req.clone({
        headers 
      });

      console.log('interceptor request intercepted: ', req.headers);
  }

  return next(req).pipe(
      tap(resp => console.log('interceptor response: Payload ', resp))
  );
}