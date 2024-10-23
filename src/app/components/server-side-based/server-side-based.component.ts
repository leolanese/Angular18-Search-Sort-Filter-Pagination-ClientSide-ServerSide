import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {FormControl,FormsModule,ReactiveFormsModule} from '@angular/forms';
import {merge,Observable,of as observableOf} from 'rxjs';
import {
  catchError,
  debounceTime,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import {ServerSideBasedPaginationService} from '../../services/server.side.based.pagination.service';

import {CommonModule} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginator,MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBar,MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSort,MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ApiResponse,ResponseItem} from '../../models/api.module';

@Component({
  selector: 'app-server-side-based',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatLabel,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './server-side-based.component.html',
  styleUrls: ['./server-side-based.component.scss'],
})
export class ServerSideBasedComponent implements OnInit, AfterViewInit {
  public tableDataService = inject(ServerSideBasedPaginationService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  columnsToDisplay: string[] = ['title', 'id', 'created', 'state'];
  data: ResponseItem[] = [];
  pageSizes = [5, 10, 20];
  totalCount = 0;
  isLoading = true;
  limitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchKeywordFilter = new FormControl('');

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.loadData();
  }

  private loadData(): void {
    merge(
      this.searchKeywordFilter.valueChanges.pipe(debounceTime(300)),
      this.sort.sortChange,
      this.paginator.page,
    )
      .pipe(
        startWith({}),
        switchMap(() => this.fetchData()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((count) => console.log(count));
  }

  private fetchData(): Observable<ApiResponse | null> {
    this.isLoading = true;
    const filterValue = this.searchKeywordFilter.value || '';

    return this.tableDataService
      .fetchTableData(
        filterValue,
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex + 1,
        this.paginator.pageSize,
      )
      .pipe(
        map((response) => {
          this.isLoading = false;
          this.totalCount = response.total_count;
          this.data = response.items;
          return response;
        }),
        catchError(() => {
          this.isLoading = false;
          this.limitReached = true;
          this.showErrorSnackBar();
          return observableOf(null);
        }),
      );
  }

  private showErrorSnackBar(): void {
    this.snackBar.open(
      'The API limit has been reached. Please try after a minute.',
      'Close',
      {
        duration: 5000,
      },
    );
  }
}
