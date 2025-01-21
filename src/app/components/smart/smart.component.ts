import {CommonModule} from '@angular/common';

import {APIService} from '@/services/api.service';
import {ToastService} from '@/shared/toastModal.component';
import {Component,DestroyRef,inject,OnInit} from '@angular/core';

import {DummyComponent} from '@/components/dummy/dummy.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {catchError,debounceTime,distinctUntilChanged,Observable,of,Subject,switchMap} from 'rxjs';

type ApiTerm = 'users' | 'products' | 'orders';

@Component({
    selector: 'app-smart',
    standalone: true,
    imports: [CommonModule, DummyComponent, NgxSkeletonLoaderModule],
    template: `
      <ng-container>
          @for(user of users$ | async; track user){
            <app-dummy 
              [user]="user" 
              (fetchDataEvent)="fetchData()"
            />
          } @empty {
            <h2>Loading...</h2> 
            <ngx-skeleton-loader
              count="5"
              [theme]="{ 
                'border-radius': '1px',
                height: '20px',
                'background-color': '#dedede',
                border: '1px solid #dedede'
              }"
            ></ngx-skeleton-loader>
          }
      </ng-container>
    `,
    styleUrl: './smart.component.scss'
})
export class SmartComponent implements OnInit {
  users$!: Observable<any[]> // Initialise to an empty observable
  
  // Subject to trigger data fetch
  private fetchDataSubject$ = new Subject<void>();
  
  #destroyRef = inject(DestroyRef);
  #apiService = inject(APIService)
  #toastService = inject(ToastService);

  ngOnInit(): void {
    this.fetchData<string>('users');
    // this.fetchData<Product>('products');
    // this.fetchData<Order>('orders');
  }

  fetchData() {
    // this.users$ = this.apiService.getTerm('users').pipe(
    //   exhaustMap(() => this.apiService.getTerm('users').pipe(
    //     takeUntilDestroyed(this.destroyRef),
    //     catchError(error => {
    //       this.#toastService.show('Error loading data!');
    //       return of([]);
    //     })
    //   ))

    // );

    // this.users$ = this.apiService$.pipe(  // Assume `searchTerm$` emits user input
    //   debounceTime(300), // Wait for user to stop typing for 300ms
    //   distinctUntilChanged(), // Only trigger if the value has changed
    //   switchMap(term => this.apiService.getTerm(term).pipe(
    //     takeUntilDestroyed(this.destroyRef), // Ensure the stream is cleaned up when the component is destroyed
    //     catchError(error => {
    //       console.error('Error fetching users:', error);
    //       return of([]); // Return empty array in case of error
    //     })
    //   ))
    // );

    // this.users$ = this.#apiService.getTerm('users').pipe(
    //   debounceTime(300), // Wait for user to stop typing for 300ms
    //   distinctUntilChanged(), // Only trigger if the value has changed
    //   //  if you expect subsequent triggers
    //   switchMap(() => this.#apiService.getTerm('users').pipe(
    //     takeUntilDestroyed(this.#destroyRef),
    //     catchError(error => {
    //       this.#toastService.show('Error loading Data!');
    //       return of([]); // Return empty array in case of error
    //     })
    //   ))
    // );

    // Reusable HTTP Service with RxJS operators
    // Replace redundant HTTP methods in your app with this service to improve readability and consistency
    //const term = 'users'; // Define the term variable
    //this.users$ = this.#apiService.get<string[]>(`${this.#apiService.apiRootUrl}${term}`).pipe(
    //  debounceTime(300), // Wait for user to stop typing for 300ms
    //  distinctUntilChanged(), // Only trigger if the value has changed
    //  if you expect subsequent triggers
    //  switchMap(() => this.#apiService.get<string[]>(`${this.#apiService.apiRootUrl}${term}`).pipe(
    //    takeUntilDestroyed(this.#destroyRef),
    //    catchError(error => {
    //      this.#toastService.show('Error loading Data!');
    //      return of([]); // Return empty array in case of error
    //    })
    //  ))
    //);

    // smart component fully reusable 
    // Generic Type (<T>): The fetchData method accepts a generic type, making it reusable for any data type
    fetchData<T>(term: ApiTerm): void {
      const url = `${this.#apiService.apiRootUrl}${term}`;

      this.data$ = this.#apiService.get<T[]>(url).pipe(
        distinctUntilChanged(), // Only trigger if the value has changed
        switchMap(() => this.#apiService.get<T[]>(url).pipe(
          takeUntilDestroyed(this.#destroyRef), // Efficient cleanup for subscriptions
        ))
      );
    }

}

