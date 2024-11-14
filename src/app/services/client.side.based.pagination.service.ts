import {HttpClient} from '@angular/common/http';
import {inject,Injectable,signal} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

interface Names {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private http = inject(HttpClient);

  constructor() {}

  // Define a signal to store the search value
  searchSig = signal<string>('');

  get getSearch$() {
    return this.searchSig;
  }
  
  setSearch(value: string): any {
    this.searchSig.set(value);
    console.log('A new signal value form Service', this.searchSig());
  }
  
  getData(): Observable<Names[]> {
    console.log('getData method called');
    return this.http.get<any[]>(this.apiUrl).pipe(
      // Transform the data to the expected structure
      map(users => users.map(user => ({ name: user.name })))
    );
  }
  
}
