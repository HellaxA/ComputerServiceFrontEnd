import { Injectable } from '@angular/core';
import {Page} from '../../entities/page/page';
import {Processor} from '../../entities/pc/processor/processor';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProcessorService {

  constructor(private httpClient: HttpClient) {
  }

  searchEntries(term: any): Observable<GetResponseProcessors> {
    const url = `${environment.apiUrl}/api/processors/search/findByNameContainingIgnoreCase?name=${term}&page=0&size=10`;
    return this.httpClient.get<any>(url).pipe(
      catchError(() => {
        console.log('Error in \'CPU Search\'');
        return of(null);
      }));
  }

  getItems(thePageNumber: number, thePageSize: number): Observable<GetResponseProcessors> {
    thePageNumber--;
    const url = `${environment.apiUrl}/api/processors?page=${thePageNumber}&size=${thePageSize}`;
    return this.httpClient.get<any>(url).pipe(
      catchError(() => {
        console.log('Error in \'CPU Search\'');
        return of(null);
      }));
  }

  findItems(thePageNumber: number, thePageSize: number, theKeyword: string): Observable<GetResponseProcessors> {
    thePageNumber--;
    const url = `${environment.apiUrl}/api/processors/search/findByNameContainingIgnoreCase?name=${theKeyword}&page=${thePageNumber}&size=${thePageSize}`;
    return this.httpClient.get<any>(url).pipe(
      catchError(() => {
        console.log('Error in \'CPU Search\'');
        return of(null);
      }));
  }
}
interface GetResponseProcessors {
  _embedded: {
    processors: Processor[];
  };
  page: Page;
}
