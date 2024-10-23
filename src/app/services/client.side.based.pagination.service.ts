import {HttpClient} from '@angular/common/http';
import {inject,Injectable} from '@angular/core';
import {Observable} from 'rxjs';

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
    const url = 'https://api.github.com/search/issues';
    const requestUrl = `${url}?q=repo:angular/components&per_page=100`;
    
    
    return this.http.get<ApiResponse>(requestUrl)
  }

}