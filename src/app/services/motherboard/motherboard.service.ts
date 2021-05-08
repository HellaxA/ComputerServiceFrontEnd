import { Injectable } from '@angular/core';
import {Page} from '../../entities/page/page';
import {Motherboard} from '../../entities/pc/motherboard/motherboard';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MotherboardService {

  constructor(private httpClient: HttpClient) {
  }

  searchEntries(term: any): Observable<GetResponseMotherboards> {
    const url = `${environment.apiUrl}/api/motherboards/search/findByNameContainingIgnoreCase?name=${term}&page=0&size=10`;
    return this.httpClient.get<any>(url).pipe(
      catchError(() => {
        console.log('Error in \'Motherboard Search\'');
        return of(null);
      }));
  }
}
interface GetResponseMotherboards {
  _embedded: {
    motherboards: Motherboard[];
  };
  page: Page;
}
