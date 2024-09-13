import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';

import { routes } from './app.routes';
import { httpRequestInterceptor } from './services/http.request.interceptor';
import { httpCacheInterceptor } from './services/http.cache.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

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
      provideRouter(routes, withPreloading(PreloadAllModules)), // Use withPreloading function
      provideAnimationsAsync()
  ]
};
