import {HttpClient} from '@angular/common/http';
import {inject,Injectable} from '@angular/core';
import {SortDirection} from '@angular/material/sort';
import {map,Observable} from 'rxjs';

export interface ApiResponse {
    items: ResponseItem[];
    total_count: number;
  }
  
  export interface ResponseItem {
    created_at: string;
    number: string;
    state: string;
    title: string;
  }

  export interface ApiRequest {
    search_filter: string,
    sort_field: string,
    sort_order: SortDirection,
    page: number,
    limit_per_page: number
  }

@Injectable({providedIn: 'root'})
export class ClientSideBasedPaginationService {
  http = inject(HttpClient);
  
  constructor() {}

  fetchTableData(payload: ApiRequest): Observable<ApiResponse> {
    const url = 'https://api.github.com/search/issues';
    const requestUrl = `${url}?q=repo:angular/components`;
    
    
    return this.http.get<ApiResponse>(requestUrl).pipe(
      map(response => ({
        items: response.items.map(item => ({
          created_at: item.created_at,
          number: item.number.toString(),
          state: item.state,
          title: item.title
        })),
        total_count: response.total_count
      }))
    );
  }

}