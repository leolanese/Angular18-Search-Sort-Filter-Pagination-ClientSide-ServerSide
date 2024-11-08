import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {appConfig} from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {})
  .catch((err: Error) => {
    console.log(err.message);
    console.log((err.cause as Error)?.message);
  });