import { CommonModule } from '@angular/common';

import { APIService } from './../../services/api.service';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { Observable, Subject, catchError, debounceTime, exhaustMap, of, switchMap } from 'rxjs';
import { DummyComponent } from './../dummy/dummy.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

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
  
  private destroyRef = inject(DestroyRef);
  private apiService = inject(APIService)

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {

    this.users$ = this.apiService.getTerm('users').pipe(
      exhaustMap(() => this.apiService.getTerm('users').pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          return of([]);
        })
      ))

    );

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

    this.users$ = this.apiService.getTerm('users').pipe(
      debounceTime(300), // Wait for user to stop typing for 300ms
      distinctUntilChanged(), // Only trigger if the value has changed
      //  if you expect subsequent triggers
      switchMap(() => this.apiService.getTerm('users').pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error('Error fetching users:', error);
          return of([]); // Return empty array in case of error
        })
      ))
    );
    
  }

}

function distinctUntilChanged(): import("rxjs").OperatorFunction<any[], unknown> {
  throw new Error('Function not implemented.');
}
