import {ClientSideFilterFormControlComponent} from "@/components/client-side-based/client-side-filter-form-control-filtering.component";
import {ClientSideSignalComponent} from "@/components/client-side-based/client-side-signal-filtering.component";
import {ChangeDetectionVisualizerComponent} from '@/shared/change-detection-visualizer';
import {ToastModalComponent} from '@/shared/toastModal.component';
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ServerSideBasedComponent} from "./components/server-side-based/server-side-based.component";
import {SmartComponent} from "./components/smart/smart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModalComponent,
    ChangeDetectionVisualizerComponent,
    ToastModalComponent,
    ClientSideFilterFormControlComponent,
    ClientSideSignalComponent,
    SmartComponent,
    ServerSideBasedComponent
],
  template: `
    <h1>{{title}}</h1>
    <app-toast-modal />

    <!-- Smart/Dymmy + Service API request + cache Interceptor = requestsInterceptor -->
     <app-smart /> 

    <!-- Server-side-based filter, sort, pagination -->
    <app-server-side-based />

    <!-- Client-side-based filter, sort, pagination using filter form control for filtering -->
    <app-client-side-filter-form-control-filtering />

    <!-- Client-side-based filter, sort, pagination using Signal for filtering -->
    <app-client-side-signal-filtering />

     <!-- <app-change-detection-visualizer />  -->
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Angular18-Search-Sort-Filter-Pagination-ClientSide-ServerSide';
}
