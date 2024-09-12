import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, debounceTime, map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  // constructor-based dependency injection
  // we declare its dependencies in the constructor, and Angular's DI system 
  // handles injecting those dependencies when the component or service is instantiated.
  http = inject(HttpClient);
  private apiRooturl = "https://jsonplaceholder.typicode.com/";

  getTerm(term: string): Observable<any[]> {
    let apiUrl =  `${this.apiRooturl}${term}`;

    return this.http.get<any[]>(apiUrl)
      .pipe(
          debounceTime(300),
          map(res => {
            return res.map(item => {
              return {
                id: item.id,
                name: item.name,
                username: item.username,
                email: item.email
              } as any;
            });
          }),
          shareReplay(1), // Cache the latest response and replay it to new subscribers
        );
  }
}