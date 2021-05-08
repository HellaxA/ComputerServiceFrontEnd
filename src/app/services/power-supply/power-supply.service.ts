import { Injectable } from '@angular/core';
import {Page} from '../../entities/page/page';
import {PowerSupply} from '../../entities/pc/powersupply/power-supply';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PowerSupplyService {

  constructor(private httpClient: HttpClient) {
  }

  searchEntries(term: any): Observable<GetResponsePowerSupplies> {
    const url = `${environment.apiUrl}/api/power-supplies/search/findByNameContainingIgnoreCase?name=${term}&page=0&size=10`;
    return this.httpClient.get<any>(url).pipe(
      catchError(() => {
        console.log('Error in \'Power Supply Search\'');
        return of(null);
      }));
  }
}
interface GetResponsePowerSupplies {
  _embedded: {
    'power-supplies': PowerSupply[];
  };
  page: Page;
}
