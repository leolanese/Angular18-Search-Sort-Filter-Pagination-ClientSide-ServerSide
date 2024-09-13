import { Injectable, inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { Observable } from 'rxjs';
import { SortDirection } from '@angular/material/sort';
import { ResponseItem, ApiResponse } from '../models/api.module';

@Injectable({
  providedIn: 'root',
})
export class ServerSideBasedPaginationService {
  http = inject(HttpClient);

  constructor() { }

  fetchTableData(
    search_filter: string,
    sort_field: string,
    sort_order: SortDirection,
    page: number,
    limit_per_page: number
  ): Observable<ApiResponse> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=${search_filter}+in:title+repo:angular/components&sort=${sort_field}&order=${sort_order}&page=${page}&per_page=${limit_per_page}`;
    return this.http.get<ApiResponse>(requestUrl);
  }

}