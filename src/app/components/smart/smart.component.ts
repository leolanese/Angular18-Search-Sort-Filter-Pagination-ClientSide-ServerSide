import { CommonModule } from '@angular/common';

import { APIService } from './../../services/api.service';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { Observable, Subject, catchError, exhaustMap, of } from 'rxjs';
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
    console.log('smart fetchData triggered');
    this.users$ = this.apiService.getTerm('users').pipe(
      exhaustMap(() => this.apiService.getTerm('users').pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error('Error fetching users:', error);
          return of([]); // Return empty array in case of error
        })
      ))
    );
  }

}