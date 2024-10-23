import {provideHttpClient,withInterceptors,withXsrfConfiguration} from '@angular/common/http';
import {ApplicationConfig,provideZoneChangeDetection} from '@angular/core';
import {PreloadAllModules,provideRouter,withPreloading,} from '@angular/router';

import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {routes} from './app.routes';
import {httpCacheInterceptor} from './services/http.cache.interceptor';
import {httpRequestInterceptor} from './services/http.request.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        httpRequestInterceptor, 
        httpCacheInterceptor({
          urlsNotToCache: ['/users'],
          globalTTL: 3000,
        }),
      ]),
      withXsrfConfiguration({
        cookieName: 'TOKEN', // 'XSRF-TOKEN'
        headerName: 'X-TOKEN' // 'X-XSRF-TOKEN'
      })
      ),
      provideZoneChangeDetection({ eventCoalescing: true }), 
      provideRouter(routes, withPreloading(PreloadAllModules)),
      provideAnimationsAsync()
  ]
};
