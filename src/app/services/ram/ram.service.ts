import { Injectable } from '@angular/core';
import {Page} from '../../entities/page/page';
import {Ram} from '../../entities/pc/ram/ram';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RamService {

  constructor(private httpClient: HttpClient) {
  }

  searchEntries(term: any): Observable<GetResponseRams> {
    const url = `${environment.apiUrl}/api/rams/search/findByNameContainingIgnoreCase?name=${term}&page=0&size=10`;
    return this.httpClient.get<any>(url).pipe(
      catchError(() => {
        console.log('Error in \'Ram Search\'');
        return of(null);
      }));
  }
}
interface GetResponseRams {
  _embedded: {
    rams: Ram[];
  };
  page: Page;
}
