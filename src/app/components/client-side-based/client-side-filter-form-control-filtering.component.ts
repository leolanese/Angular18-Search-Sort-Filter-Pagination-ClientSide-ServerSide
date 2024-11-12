import {CommonModule} from '@angular/common';

import {Component,DestroyRef,inject,OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder,FormControl,FormGroup,ReactiveFormsModule} from '@angular/forms';
import {combineLatest,Observable,of} from 'rxjs';
import {catchError,debounceTime,distinctUntilChanged,map,shareReplay,startWith,tap} from 'rxjs/operators';

import {SearchService} from '../../services/client.side.based.pagination.service';
import {HttpErrorService} from '../../shared/http-error.service';
import {ToastService} from '../../shared/toastModal.component';
import {FilterInputComponent} from "./Filter-input.component";
import {ListComponent} from "./List.component";
import {PaginationComponent} from "./Pagination.component";
import {SortDropdownComponent} from "./Sort-dropdown.component";

@Component({
  selector: 'app-client-side-filter-form-control-filtering',
  standalone: true,
  template: `
    <h3>{{ title }}</h3>
    <div class="container">
      <form [formGroup]="form">
        
        <!-- Filter Input -->
        <app-filter-input [filterControl]="filter"></app-filter-input>

        <!-- Sort Dropdown -->
        <app-sort-dropdown (sortChanged)="sort($event)"></app-sort-dropdown>

        <!-- List -->
       <app-list [countries]="(filteredResult$ | async) ?? []"></app-list>
       <p>Total found: {{ filteredCount }}</p>

        <!-- Pagination -->
        <app-pagination
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          (pageChange)="onPageChange($event)">
        </app-pagination>

      </form>
    </div>
  `,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent, ListComponent, SortDropdownComponent, FilterInputComponent],
  providers: [SearchService, HttpErrorService, ToastService] // declare dependencies isolated mod not globally provided
})
export class ClientSideFilterFormControlComponent implements OnInit {
  title = 'Filter Form Control based: Search, Sort, and Pagination Components using Array/List Data Structure';
  data$: Observable<any[]> = of([]);
  filteredResult$!: Observable<any[]>;
  form: FormGroup;
  filter: FormControl;
  sortDirection: string = 'asc';
  currentPage = 0;
  totalPages = 0;
  pageSize = 3; 
  sortOrder: 'asc' | 'desc' = 'asc';
  filteredCount = 0;
 
  private searchService = inject(SearchService)
  private fb = inject(FormBuilder)
  private destroyRef = inject(DestroyRef)
  private toastService = inject(ToastService);
  private errorService = inject(HttpErrorService);

  constructor() {
    this.form = this.fb.group({
      filter: ['']
    });
    this.filter = this.form.get('filter') as FormControl;
  }

  ngOnInit() {
    // Fetch data and cache it
    this.data$ = this.searchService.getData().pipe(
      startWith([]), // Emit an empty array before the actual data arrives
      shareReplay(1), // Cache the data to avoid re-fetching it on every subscription
      catchError((err) => {
        this.errorService.formatError(err)
        this.toastService.show('Error loading Data');

        return of([]); // Return an empty array in case of an error
      })
    );

    const filter$ = this.filter.valueChanges.pipe(
      tap(value => console.log('Typed Value in Filter Input:', value)) ,
      distinctUntilChanged(),
      debounceTime(300)
    );

    this.filteredResult$ = combineLatest([this.data$, filter$]).pipe(
      map(([values, filterString]) => {
        this.currentPage = 0; // Reset the current page whenever filtering changes
        const filteredData = this.applyFilterSortPagination(values, filterString);
        this.totalPages = Math.ceil(filteredData.length / this.pageSize); // Update total pages based on filtered data
        // Slice the filtered data for pagination
        const start = this.currentPage * this.pageSize;

        return filteredData.slice(start, start + this.pageSize);
      }),
      takeUntilDestroyed(this.destroyRef) 
    );
  
    // Subscribe to filter changes to update the filtered data immediately
    filter$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.updateFilteredData(); // Call to update the filtered data immediately
    });

  }

  sort(sortOrder: 'asc' | 'desc'): void {
    this.sortOrder = sortOrder;

    this.sortDirection = sortOrder;
    this.filteredResult$ = this.data$.pipe(
      startWith([]), // Ensure that an empty array is emitted immediately
      map(values => this.applyFilterSortPagination(values, this.filter.value)),
      takeUntilDestroyed(this.destroyRef) 
    );
  }

  nextPage() {
    this.currentPage++;
    this.updateFilteredData();
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateFilteredData();
    }
  }

  private applyFilterSortPagination(countries: any[], filterString: string) {
    // Filtering
    let filtered = countries.filter(country =>
      country.name.toLowerCase().includes(filterString.toLowerCase())
    );

    // Update the count of filtered data
    this.filteredCount = filtered.length;

    // sorting
    filtered = filtered.sort((a, b) =>
      this.sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    return filtered;
  }

  private updateFilteredData() {
    this.filteredResult$ = this.data$.pipe(
      startWith([]),
      map(values => {
        const filteredData = this.applyFilterSortPagination(values, this.filter.value);
        this.totalPages = Math.ceil(filteredData.length / this.pageSize); // Recalculate total pages
        const start = this.currentPage * this.pageSize;

        return filteredData.slice(start, start + this.pageSize);
      })
    );
  }

  onPageChange(newPage: number) {
    console.log(newPage)
    this.currentPage = newPage;
    this.updateFilteredData();
  }
  
}
