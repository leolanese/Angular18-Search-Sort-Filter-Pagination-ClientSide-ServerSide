import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SmartComponent } from "./components/smart/smart.component";
import { ServerSideBasedComponent } from './components/server-side-based/server-side-based.component';
import { ClientSideBasedComponent } from './components/client-side-based/client-side-based.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    SmartComponent, ServerSideBasedComponent, ClientSideBasedComponent
  ],
  template: `
    <h1>{{title}}</h1>

    <!-- Smart/Dymmy + Service API request + cache Interceptor = requestsInterceptor -->
    <!-- <app-smart /> -->

    <!-- Server-side-based filter, sort, pagination -->
    <!-- <app-server-side-based></app-server-side-based> -->

    <!-- Client-side-based filter, sort, pagination -->
    <app-client-side-based></app-client-side-based>

  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Company-test';
}
