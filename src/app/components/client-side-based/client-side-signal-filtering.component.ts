import {CommonModule} from '@angular/common';

import {Component,DestroyRef,inject,OnInit,signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder,FormGroup,ReactiveFormsModule} from '@angular/forms';
import {combineLatest,Observable,of} from 'rxjs';
import {catchError,map,shareReplay,startWith,tap} from 'rxjs/operators';

import {SearchService} from '../../services/client.side.based.pagination.service';
import {HttpErrorService} from '../../shared/http-error.service';
import {ToastService} from '../../shared/toastModal.component';
import {FilterInputComponent} from "./Filter-input.component";
import {ListComponent} from "./List.component";
import {PaginationComponent} from "./Pagination.component";
import {SortDropdownComponent} from "./Sort-dropdown.component";

@Component({
  selector: 'app-client-side-signal-filtering',
  standalone: true,
  template: `
    <h3>{{ title }}</h3>
    <div class="container">
      <form [formGroup]="form">
        
        <!-- Filtsr Input using signal -->
        <input type="text" (keyup)="search($event)" placeholder="Type to search..." />
        <!-- <p>Typed Value: {{ searchSig() }}</p>  -->

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
export class ClientSideSignalComponent implements OnInit {
  title = 'Signal based: Search, Sort, and Pagination Components using Array/List Data Structure';
  data$: Observable<any[]> = of([]);
  filteredResult$!: Observable<any[]>;
  form: FormGroup;
  sortDirection: string = 'asc';
  currentPage = 0;
  totalPages = 0;
  pageSize = 3; 
  sortOrder: 'asc' | 'desc' = 'asc';
  filteredCount = 0;
  // create a signal which stores our search value
  searchSignal = signal<string>('');
   
  private searchService = inject(SearchService)
  private fb = inject(FormBuilder)
  private destroyRef = inject(DestroyRef)
  private toastService = inject(ToastService);
  private errorService = inject(HttpErrorService);

  constructor() {
    this.form = this.fb.group({
      filter: ['']
    });
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

    // Update the filtered data whenever the search signal changes
    this.filteredResult$ = combineLatest([this.data$, this.searchSignal()]).pipe(
      map(([values, filterString]) => {
        console.log('Map operator called');
        this.currentPage = 0; // Reset page whenever filtering changes
        const filteredData = this.applyFilterSortPagination(values, filterString);
        this.totalPages = Math.ceil(filteredData.length / this.pageSize);
        const start = this.currentPage * this.pageSize;

        return filteredData.slice(start, start + this.pageSize);
      }),
      takeUntilDestroyed(this.destroyRef),
      tap(filteredData => console.log('Filtered Result:', filteredData))
    );

  }
 
  search(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    // update this signal when we change the input with set method
    this.searchSignal.set(value);
    console.log('Typed Value:', value);
  }

  sort(sortOrder: 'asc' | 'desc'): void {
    this.sortOrder = sortOrder;
    this.sortDirection = sortOrder;

    this.filteredResult$ = this.data$.pipe(
      map(values => this.applyFilterSortPagination(values, this.searchSignal())),
      takeUntilDestroyed(this.destroyRef) 
    );
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.updateFilteredData();
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
    console.log('Applying filter with:', filterString); // Log filterString

    // Use the signal value directly for filtering
    let filtered = countries.filter(country =>
      country.name.toLowerCase().includes(filterString.toLowerCase())
    );

    console.log('Filtered results:', filtered); // Log filtered data

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
      map(values => {
        const filteredData = this.applyFilterSortPagination(values, this.searchSignal());
        this.totalPages = Math.ceil(filteredData.length / this.pageSize); // Recalculate total pages
        const start = this.currentPage * this.pageSize;

        return filteredData.slice(start, start + this.pageSize);
      })
    );
  }
  
}
