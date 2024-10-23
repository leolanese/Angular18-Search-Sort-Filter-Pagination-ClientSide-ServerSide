import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChangeDetectionVisualizerComponent} from './components/change-detection-visualizer/change-detection-visualizer';
import {ClientSideBasedComponent} from "./components/client-side-based/client-side-based.component";
import {ToastModalComponent} from './shared/toastModal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModalComponent,
    ChangeDetectionVisualizerComponent,
    ToastModalComponent,
    ClientSideBasedComponent
],
  template: `
    <h1>{{title}}</h1>
    <app-toast-modal></app-toast-modal>

    <!-- Smart/Dymmy + Service API request + cache Interceptor = requestsInterceptor -->
    <!-- <app-smart /> -->

    <!-- Server-side-based filter, sort, pagination -->
    <!-- <app-server-side-based></app-server-side-based> -->

    <!-- Client-side-based filter, sort, pagination -->
    <app-client-side-based></app-client-side-based>

    <app-change-detection-visualizer />
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Angular18-Search-Sort-Filter-Pagination-ClientSide-ServerSide';
}
