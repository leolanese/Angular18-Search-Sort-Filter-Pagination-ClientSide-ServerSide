import {HttpClient} from '@angular/common/http';
import {Injectable,inject} from '@angular/core';
import {Observable,catchError,debounceTime,map,shareReplay,throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  // constructor-based dependency injection
  http = inject(HttpClient);
   apiRootUrl = "https://jsonplaceholder.typicode.com/";

  // Specific method to fetch terms with debouncing, mapping, and caching
  getTerm = (term: string): Observable<any[]> => {
    const apiUrl = `${this.apiRootUrl}${term}`;

    return this.http.get<any[]>(apiUrl)
      .pipe(
          debounceTime(300),
          map(res => res.map(item => ({
            id: item.id,
            name: item.name,
            username: item.username,
            email: item.email
          }))),
          shareReplay(1), // Cache the latest response and replay it to new subscribers
        );
  }

  // Generic method to make GET requests with optional caching
  // map will not be inside as it is generic
  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      debounceTime(300),
      shareReplay(1), // Cache the response to avoid multiple requests
      catchError((error) => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Failed to fetch data.'));
      })
    );
  }

}