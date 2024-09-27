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

  //  arrow functions capture the this value of their enclosing context at the time they're defined, 
  // they retain the correct this reference no matter how they're called.
  getTerm = (term: string): Observable<any[]> => {
    let apiUrl =  `${this.apiRooturl}${term}`;

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
}