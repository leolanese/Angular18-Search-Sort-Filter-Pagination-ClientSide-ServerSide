import {CommonModule} from '@angular/common';

import {Component,DestroyRef,inject,OnInit} from '@angular/core';
import {APIService} from './../../services/api.service';

import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {catchError,debounceTime,distinctUntilChanged,Observable,of,Subject,switchMap} from 'rxjs';
import {ToastService} from '../../shared/toastModal.component';
import {DummyComponent} from './../dummy/dummy.component';

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
    this.fetchData();
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

    this.users$ = this.#apiService.getTerm('users').pipe(
      debounceTime(300), // Wait for user to stop typing for 300ms
      distinctUntilChanged(), // Only trigger if the value has changed
      //  if you expect subsequent triggers
      switchMap(() => this.#apiService.getTerm('users').pipe(
        takeUntilDestroyed(this.#destroyRef),
        catchError(error => {
          this.#toastService.show('Error loading desserts!');
          return of([]); // Return empty array in case of error
        })
      ))
    );
    
  }

}

