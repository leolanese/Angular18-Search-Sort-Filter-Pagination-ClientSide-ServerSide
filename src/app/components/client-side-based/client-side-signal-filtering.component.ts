import {CommonModule} from '@angular/common';

import {ChangeDetectionStrategy,Component,DestroyRef,inject,OnInit} from '@angular/core';
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
          [currentPage]="currentPage"
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

  sortDirection: string = 'asc';
  currentPage = 0;
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
      of(this.currentPage) // React to changes in currentPage signal
    ]).pipe(
      tap(([data, filterString]) => {
        console.log("Data received:", data);
        console.log("Filter string received:", filterString);
      }),
      map(([data, filterString]) => this.applyFilterSortPagination(data, filterString)),
      tap(filteredData => {
        this.filteredCount = filteredData.length;
        this.totalPages = Math.ceil(filteredData.length / this.pageSize);
        console.log("Final Filtered Data:", filteredData);
      }),
      takeUntilDestroyed(this.destroyRef) 
    );

  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.currentPage = 0; // Reset to first page on new search
    this.searchService.searchSig.set(value); // Update the signal directly
  }

  sort(sortOrder: 'asc' | 'desc'): void {
    this.sortOrder = sortOrder;
    this.sortDirection = sortOrder;
    this.currentPage = 0; // Reset to first page on new sort
    this.updateFilteredData();
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.updateFilteredData();
  }

  private applyFilterSortPagination(data: any[], filterString: string) {
    // Return empty array if no search term is present
    if (!filterString.trim()) {
      this.filteredCount = 0;
      return []; 
    }

    // Filtering
    let filtered = data.filter(val =>
      val.name.toLowerCase().includes(filterString.toLowerCase())
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
    // Only updates filteredResult$ by triggering it on page or sort changes
    this.filteredResult$ = combineLatest([
      this.data$,
      this.searchSig$,
      of(this.currentPage) // React to currentPage changes
    ]).pipe(
      map(([data, filterString]) => {
        const filteredData = this.applyFilterSortPagination(data, filterString);
        this.filteredCount = filteredData.length;
        this.totalPages = Math.ceil(filteredData.length / this.pageSize);
        return filteredData;
      }),
      takeUntilDestroyed(this.destroyRef) 
    );
  }
  
}
