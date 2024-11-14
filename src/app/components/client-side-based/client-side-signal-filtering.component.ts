import {CommonModule} from '@angular/common';

import {ChangeDetectionStrategy,Component,DestroyRef,inject,OnInit,signal} from '@angular/core';
import {takeUntilDestroyed,toObservable} from '@angular/core/rxjs-interop';
import {combineLatest,Observable,of} from 'rxjs';
import {catchError,map,shareReplay,startWith,tap} from 'rxjs/operators';

import {SearchService} from '@/services/client.side.based.pagination.service';
import {HttpErrorService} from '@/shared/http-error.service';
import {ToastService} from '@/shared/toastModal.component';
import {FilterInputSignalComponent} from './Filter-input-signal.component';
import {ListComponent} from "./List.component";
import {PaginationComponent} from "./Pagination.component";
import {SortDropdownComponent} from "./Sort-dropdown.component";

@Component({
  selector: 'app-client-side-signal-filtering',
  standalone: true,
  template: `
    <h3>{{ title }}</h3>
    <div class="container">
      <form>
        
        <!-- Use the SearchInput component and handle the search event -->
        <app-filter-input-signal (searchChanged)="onSearch($event)" />

        <!-- Sort Dropdown -->
        <app-sort-dropdown (sortChanged)="sort($event)"></app-sort-dropdown>

        <!-- List -->
       <!-- <app-list [countries]="(filteredResult$ | async) ?? []"></app-list>
       <p>Total found: {{ filteredCount }}</p> -->
       <app-list  [countries]="(filteredResult$ | async) ?? []"></app-list>
       <p>Total found: {{ filteredCount }}</p>

        <!-- Pagination -->
        <app-pagination
          [currentPage]="currentPage()"
          [totalPages]="totalPages"
          (pageChange)="onPageChange($event)">
        </app-pagination>

      </form>
    </div>
  `,
  imports: [CommonModule, PaginationComponent, ListComponent, SortDropdownComponent, FilterInputSignalComponent],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ClientSideSignalComponent implements OnInit {
  title = 'Signal based: Search, Sort, and Pagination Components using Array/List Data Structure';
  data$: Observable<any[]> = of([]);
  filteredResult$!: Observable<any[]>;
  // create a signal which stores our search value
  searchSig$ = toObservable(inject(SearchService).searchSig); // Convert to observable in constructor context
  currentPage = signal(0); // currentPage signal

  sortDirection: string = 'asc';
  totalPages = 0;
  pageSize = 3; 
  sortOrder: 'asc' | 'desc' = 'asc';
  filteredCount = 0;

  private searchService = inject(SearchService)
  private destroyRef = inject(DestroyRef)
  private toastService = inject(ToastService);
  private errorService = inject(HttpErrorService);

  constructor() { }

  ngOnInit() {
    // Data provided by SearchService
    this.data$ = this.searchService.getData().pipe(
      tap(([data, filterString]) => {
        console.log("Data received:", data);
        console.log("Filter string received:", filterString);
      }),
      startWith([]), // Emit an empty array before the actual data arrives
      shareReplay(1), // Cache the data to avoid re-fetching it on every subscription
      catchError((err) => {
        this.errorService.formatError(err)
        this.toastService.show('Error loading Data');
        return of([]); // Return an empty array in case of an error
      })
    );

    this.filteredResult$ = combineLatest([
      this.data$, // initial data Observable
      this.searchSig$, // search signal Observable
      of(this.currentPage), // Convert currentPage signal to observable
    ]).pipe(
      map(([data, filterString, currentPage]) => 
        this.applyFilterSortPagination(data, filterString, currentPage)),
      tap(filteredData => {
        this.filteredCount = filteredData.length;
        this.totalPages = Math.ceil(filteredData.length / this.pageSize);
      }),
      takeUntilDestroyed(this.destroyRef) 
    );
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.searchSig.set(value); // Update the signal directly
  }

  sort(sortOrder: 'asc' | 'desc'): void {
    this.sortOrder = sortOrder;
    this.sortDirection = sortOrder;

    this.updateFilteredData();
  }

  onPageChange(newPage: number) {
    this.currentPage.set(newPage);
    this.updateFilteredData();
    console.log('Current Page:', this.currentPage());
  }

  private applyFilterSortPagination(data: any[], filterString: string, currentPage: any) {
    // Return empty array if no search term is present
    if (!filterString.trim()) {
      this.filteredCount = 0;
      return []; 
    }

    // Filtering
    let filtered = data.filter(item =>
      item.name.toLowerCase().includes(filterString.toLowerCase())
    );

    console.log("Filtered Data applyFilterSortPagination:", filtered);  // Log filtered data here

    // Update the count of filtered data
    this.filteredCount = filtered.length;

    // sorting data
    filtered = filtered.sort((a, b) =>
      this.sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    // pagination logic here
    const startIndex = currentPage  * this.pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + this.pageSize);

    // Update totalPages based on filtered data
    this.totalPages = Math.ceil(filtered.length / this.pageSize);

    return filtered
  }

  private updateFilteredData() {
    this.filteredResult$ = combineLatest([
      this.data$,
      this.searchSig$,
      of(this.currentPage)
    ]).pipe(
      tap(([data, filterString, currentPage]) => {
        console.log("Data received:", data);
        console.log("Filter string received:", filterString);
        console.log("Current Page:", currentPage) 
      }),
      map(([data, filterString, currentPage ]) => {
        const filteredData = this.applyFilterSortPagination(data, filterString, currentPage );
        this.filteredCount = filteredData.length;
        this.totalPages = Math.ceil(filteredData.length / this.pageSize);
        const start = this.currentPage() * this.pageSize;

        return filteredData.slice(start, start + this.pageSize);
      }),
      takeUntilDestroyed(this.destroyRef) 
    );
  }
  
}
