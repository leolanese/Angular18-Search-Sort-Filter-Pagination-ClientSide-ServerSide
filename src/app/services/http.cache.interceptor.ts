import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Subject, filter, finalize, of, tap } from 'rxjs';

const requests = new Map<
  string,
  {
    src: string;
    data: HttpResponse<any>;
    data$: Subject<HttpResponse<any>>;
    params?: any;
    ttl?: number;
  }
>();

// Results:
// The interceptor works by caching HTTP responses 
// so that repeated requests for the same resource don't trigger additional HTTP calls

/**
 *  - Actions:
 *  Caching: 
 *  The interceptor looks for the request in the requests map. If found and valid (TTL not expired), the cached response is returned. Otherwise, it fetches fresh data from the server.
 *  
 *  Preventing Duplicate Requests: 
 *  If a request is made while another is still pending, new subscribers will receive the same response via the data$ observable.
 *  
 *  TTL: 
 *  The cache has a TTL (time-to-live). 
 *  Once expired, the next request will refetch fresh data from the server. 
 * 
 *  - Results:
 *  For every HTTP request, we check whether the request is already made. If it’s found, we return the Subject() data$ or the HttpResponse data, if the conditions met.
 *  All the subsequent requests will either subscribe to the data$ or data without making any new API call. Otherwise we reset the Subject().
 */

export const httpCacheInterceptor = (options?: {
  urlsNotToCache?: string[];
  ttls?: { [url: string]: number };
  globalTTL?: number;
}) => {
  console.log('Interceptor cache triggered: ', options);

  const { urlsNotToCache = [], ttls, globalTTL } = options ?? {};

  // Core Logic
  const fn: HttpInterceptorFn = (req, next) => {
    const key = `${req.url}_${JSON.stringify(req.body)}`;

    // Cache Lookup
    const skipCache = urlsNotToCache.some((x) => new RegExp(x).test(req.url));
    const prevRequest = () => {
      return requests.get(key);
    };

    const prevReq = prevRequest();
    const getTTL = () => {
      return new Date().getTime() + (ttls?.[req.url] ?? globalTTL ?? 0);
    };

    // Returning Cached Data
    if (!skipCache) {
      if (prevReq) {
        const { data, data$, ttl } = prevReq;

        if (!data$.closed) {
          return prevReq.data$;
        }

        if (data && ttl && ttl > new Date().getTime()) {
          return of(prevReq.data);
        }

        prevReq.data$ = new Subject<any>();
      } else {
        requests.set(key, {
          src: req.url,
          data$: new Subject<HttpResponse<any>>(),
          data: new HttpResponse<any>(),
          params: req.body,
          ttl: getTTL(),
        });
      }
    }

    // Making the HTTP Request
    // If there is no valid cached data, the interceptor allows the request to proceed
    return next(req).pipe(
      filter((x) => x instanceof HttpResponse),
      tap((x) => {
        const data = x as HttpResponse<any>;
        const r = prevRequest();
        if (!r) return;

        r.data = data;
        r.ttl = getTTL();
        !r.data$.closed && r.data$.next(data);
      }),
      finalize(() => {
        const r = prevRequest();
        r?.data$.complete();
        r?.data$.unsubscribe();
      })
    );
  };

  return fn;
};