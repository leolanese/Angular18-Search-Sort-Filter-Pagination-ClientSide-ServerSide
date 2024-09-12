import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class ClientSideBasedPaginationService {
  http = inject(HttpClient);
  
  constructor() {}

fetchTableData(): Observable<ApiResponse> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=repo:angular/components&per_page=100`;
    
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