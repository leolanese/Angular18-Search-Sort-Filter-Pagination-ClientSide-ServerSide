import {Injectable} from '@angular/core';
import {PreloadingStrategy,Route} from '@angular/router';
import {Observable,of,timer} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DelayBasedPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const delay = parseInt(route.data?.['preload'] ?? '0', 10);
    return delay
      ? timer(delay).pipe(switchMap(() => load()))
      : of(null);
  }

  // consuming the strategy:
  // bootstrapApplication(AppComponent, {
  //   providers: [
  //     provideRouter(routes, withPreloading(DelayBasedPreloadingStrategy))
  //   ],
  // });

  // consuming the strategy:
  // const routes: Routes = [
  //   {
  //     path: 'feature',
  //     loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule),
  //     data: { preload: 3000 }, // Preload after 3 seconds
  //   },
  //   {
  //     path: 'another-feature',
  //     loadChildren: () => import('./another-feature/another-feature.module').then(m => m.AnotherFeatureModule),
  //     data: { preload: 0 }, // No preloading
  //   },
  // ];
}
