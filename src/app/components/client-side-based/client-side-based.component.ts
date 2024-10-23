import {CommonModule} from '@angular/common';
import {Component,inject,OnInit} from '@angular/core';
import {FormBuilder,FormControl,ReactiveFormsModule} from '@angular/forms';
import {MatPaginatorModule,PageEvent} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Sort} from '@angular/material/sort';
import {MatTableDataSource,MatTableModule} from '@angular/material/table';
import {debounceTime,distinctUntilChanged,startWith,switchMap} from 'rxjs/operators';

import {MatCard} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ApiRequest,ClientSideBasedPaginationService,ResponseItem} from '../../services/client.side.based.pagination.service';

@Component({
  selector: 'app-client-side-based',
  standalone: true,
  template: `
    <div *ngIf="isLoading" class="loading-indicator">
      <mat-spinner></mat-spinner>
    </div>

    <mat-card>
      <mat-form-field class="search">
        <mat-label>Search (using client-side search)</mat-label>
        <input matInput [formControl]="searchKeywordFilter" placeholder="Title to Search">
      </mat-form-field>

      <div class="table-wrapper">
        <table mat-table [dataSource]="dataSource" matSort matSortDirection="desc" class="mat-elevation-z8">
        
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let row">{{ row.number }}</td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Title</th>
            <td mat-cell *matCellDef="let row">{{ row.title }}</td>
          </ng-container>

          <ng-container matColumnDef="state">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>State</th>
            <td mat-cell *matCellDef="let row">{{ row.state }}</td>
          </ng-container>

          <ng-container matColumnDef="created">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Created</th>
            <td mat-cell *matCellDef="let row">{{ row.created_at | date }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
          <tr mat-row *matRowDef="let row; columns: columnsToDisplay"></tr>
        </table>

        <mat-paginator [length]="totalCount" [pageSizeOptions]="pageSizes"
          aria-label="Select page" showFirstLastButtons (page)="onPageChange($event)">
        </mat-paginator>
        
      </div>
    </mat-card>
  `,
  imports: [
    CommonModule, ReactiveFormsModule, 
    MatProgressSpinnerModule,
    MatInputModule,
    MatPaginatorModule,
    MatCard,
    MatFormFieldModule,
    MatTableModule
  ]
})
export class ClientSideBasedComponent implements OnInit {
  searchKeywordFilter = new FormControl('');
  dataSource = new MatTableDataSource<ResponseItem>();
  isLoading = false;
  totalCount = 0;
  currentPage = 0;
  pageSize = 3; 
  sortOrder: 'asc' | 'desc' = 'asc';
  sortField = 'created_at';
  pageSizes = [3, 5, 10];
  columnsToDisplay = ['id', 'title', 'state', 'created'];

  private paginationService = inject(ClientSideBasedPaginationService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.searchKeywordFilter.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(filterValue => {
        this.isLoading = true;
        const payload: ApiRequest = {
          search_filter: filterValue || '',
          sort_field: this.sortField,
          sort_order: this.sortOrder,
          page: this.currentPage + 1,
          limit_per_page: this.pageSize
        };
        return this.paginationService.fetchTableData(payload);
      })
    ).subscribe(response => {
      this.dataSource.data = response.items;
      this.totalCount = response.total_count;
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  sortData(sort: Sort) {
    this.sortField = sort.active;
    this.sortOrder = sort.direction || 'asc';
    this.currentPage = 0; // Reset to the first page on sort change
    this.fetchData();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchData();
  }

  private fetchData() {
    this.isLoading = true;
    const payload: ApiRequest = {
      search_filter: this.searchKeywordFilter.value || '',
      sort_field: this.sortField,
      sort_order: this.sortOrder,
      page: this.currentPage + 1,
      limit_per_page: this.pageSize
    };
    this.paginationService.fetchTableData(payload).subscribe(response => {
      this.dataSource.data = response.items;
      this.totalCount = response.total_count;
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }
}
