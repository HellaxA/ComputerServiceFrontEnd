import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {Page} from '../../entities/page/page';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GpuService {

  constructor(private httpClient: HttpClient) {
  }

  searchEntries(term: any): Observable<GetResponseGpus> {
    const url = `${environment.apiUrl}/api/gpus/search/findByNameContainingIgnoreCase?name=${term}&page=0&size=10`;
    return this.httpClient.get<any>(url).pipe(
      catchError(() => {
        console.log('Error in \'GPU Search\'');
        return of(null);
      }));
  }
}

interface GetResponseGpus {
  _embedded: {
    gpus: Gpu[];
  };
  page: Page;
}
