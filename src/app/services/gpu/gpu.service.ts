import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {Page} from '../../entities/page/page';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GpuService {

  constructor(private httpClient: HttpClient) {
  }

  search(terms: Observable<string>): Observable<GetResponseGpus> {
    return terms.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term)));
  }

  searchEntries(term: any): Observable<GetResponseGpus> {
    const url = `${environment.apiUrl}/api/gpus/search/findByNameContainingIgnoreCase?name=${term}&page=0&size=10`;
    return this.httpClient.get<any>(url);
  }
}

interface GetResponseGpus {
  _embedded: {
    gpus: Gpu[];
  };
  page: Page;
}
