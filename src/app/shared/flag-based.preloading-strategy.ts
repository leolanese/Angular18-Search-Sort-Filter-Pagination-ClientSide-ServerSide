import {Injectable} from "@angular/core";
import {PreloadingStrategy,Route} from "@angular/router";

import {Observable,of} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class FlagBasedPreloadingStrategy extends PreloadingStrategy {
  // 👇 For clarity, I prefer `load` rather than `fn` for the callback name
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data?.["preload"] === true ? load() : of(null);
  }

  // consuming the strategy:
  // bootstrapApplication(AppComponent, {
  //   providers: [
  //     provideRouter(routes, withPreloading(FlagBasedPreloadingStrategy))
  //   ],
  // });
}