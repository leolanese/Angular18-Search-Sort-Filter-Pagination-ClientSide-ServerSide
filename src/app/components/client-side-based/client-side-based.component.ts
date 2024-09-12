import { AfterViewInit, Component, OnInit, ViewChild, inject} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { ClientSideBasedPaginationService } from '../../services/client.side.based.pagination.service';
import { ResponseItem, ApiResponse } from '../../models/api.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, Observable, startWith, combineLatest, map, debounceTime, distinctUntilChanged, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';

class CustomDataSource extends DataSource<ResponseItem> {
  private dataSubject = new BehaviorSubject<ResponseItem[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  loading$ = this.loadingSubject.asObservable();

  constructor(private clientSideBasedPaginationService: ClientSideBasedPaginationService) {
    super();
    this.loadData();
  }

  loadData() {
    this.clientSideBasedPaginationService.fetchTableData().subscribe(
      response => {
        this.dataSubject.next(response.items);
        this.loadingSubject.next(false);
      }
    );
  }

  connect(): Observable<ResponseItem[]> {
    return this.dataSubject.asObservable();
  }

  disconnect() {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }
}


function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-client-side-based',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, ReactiveFormsModule,
    MatCard, MatFormField, MatLabel, MatTableModule, MatFormFieldModule,
    MatSortModule, MatPaginatorModule, MatSelectModule, MatInputModule, MatButtonModule,
    MatTooltipModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './client-side-based.component.html',
  styleUrl: './client-side-based.component.scss'
})
export class ClientSideBasedComponent implements OnInit, AfterViewInit {
  columnsToDisplay: string[] = ['title', 'number', 'created', 'state'];
  pageSizes = [5, 10, 20];
  isLoading = true;

  dataSource: CustomDataSource;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchKeywordFilter = new FormControl('');

  constructor(private clientSideBasedPaginationService: ClientSideBasedPaginationService) {
    this.dataSource = new CustomDataSource(this.clientSideBasedPaginationService);
  }

  ngOnInit(): void {
    // The data loading is now handled by the CustomDataSource
    this.dataSource.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  ngAfterViewInit() {
    this.setupSorting();
    this.setupFiltering();
    this.setupPagination();
  }

  private setupSorting() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        map(() => this.getSortedData([...this.dataSource['dataSubject'].value]))
      )
      .subscribe(data => { 
        this.dataSource['dataSubject'].next(data);
      });
  }

  private setupFiltering() {
    this.searchKeywordFilter.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map(value => this.filterData(value))
      )
      .subscribe(filteredData => {
        this.paginator.pageIndex = 0;
        this.dataSource['dataSubject'].next(filteredData);
      });
  }

  private setupPagination() {
    this.paginator.page
      .pipe(
        startWith({}),
        map(() => {
          const data = this.dataSource['dataSubject'].value;
          const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
          return data.slice(startIndex, startIndex + this.paginator.pageSize);
        })
      )
      .subscribe(paginatedData => { 
        this.dataSource['dataSubject'].next(paginatedData);
      });
  }

  private getSortedData(data: ResponseItem[]): ResponseItem[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'title': return compare(a.title, b.title, isAsc);
        case 'number': return compare(a.number, b.number, isAsc);
        case 'created': return compare(a.created_at, b.created_at, isAsc);
        case 'state': return compare(a.state, b.state, isAsc);
        default: return 0;
      }
    });
  }

  private filterData(filterValue: any): ResponseItem[] {
    return this.dataSource['dataSubject'].value.filter(item =>
      item.title.toLowerCase().includes(filterValue.toLowerCase())
    );
  }
  
}
