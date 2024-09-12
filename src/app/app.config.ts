import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

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
      ])),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync()]
};
