import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PcIds} from '../../entities/pc/pc/pcIds';
import {GetPcCompatibilityCheck} from '../../entities/get-pc-compatibility-check/get-pc-compatibility-check';
import {PcReqAndResDto} from '../../entities/pc-req-and-res-dto/pc-req-and-res-dto';
import {Pc} from '../../entities/pc/pc/pc';
import {PcCompListDto} from '../../entities/pc/pc/pc-comp-list-dto';
import {catchError} from 'rxjs/operators';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {Page} from '../../entities/page/page';

@Injectable({
  providedIn: 'root'
})
export class PcService {

  constructor(private httpClient: HttpClient) {
  }

  checkPcCompatibility(pc: PcIds): Observable<GetPcCompatibilityCheck> {
    const url = `${environment.apiUrl}/api/pc/compatibility/check`;
    return this.httpClient.post<GetPcCompatibilityCheck>(url, pc);
  }

  fixComputerAssembly(checkResponse: GetPcCompatibilityCheck, pc: Pc): Observable<PcCompListDto> {
    const pcReqAndRes = new PcReqAndResDto(checkResponse, pc);
    const url = `${environment.apiUrl}/api/pc/compatibility/fix`;
    return this.httpClient.post<PcCompListDto>(url, pcReqAndRes);
  }

  proposeComponents(pcIdsWithMaxPriceDto): Observable<PcCompListDto> {
    const url = `${environment.apiUrl}/api/pc/compatibility/propose`;
    return this.httpClient.post<PcCompListDto>(url, pcIdsWithMaxPriceDto);
  }

  savePc(pcIds: PcIds): Observable<any> {
    const url = `${environment.apiUrl}/api/pc/compatibility/save`;
    return this.httpClient.post<PcCompListDto>(url, pcIds);
  }

  getItems(thePageNumber: number, thePageSize: number): Observable<GetResponsePCs> {
    thePageNumber--;
    const url = `${environment.apiUrl}/api/pc/findAll?page=${thePageNumber}&size=${thePageSize}`;
    return this.httpClient.get<any>(url).pipe(
      catchError(() => {
        console.log('Error in \'GPU Search\'');
        return of(null);
      }));
  }

  findItems(thePageNumber: number, thePageSize: number, theKeyword: string): Observable<GetResponsePCs> {
    thePageNumber--;
    const url = `${environment.apiUrl}/api/pcs/search/findByNameContainingIgnoreCase?name=${theKeyword}&page=${thePageNumber}&size=${thePageSize}`;
    return this.httpClient.get<any>(url).pipe(
      catchError(() => {
        console.log('Error in \'GPU Search\'');
        return of(null);
      }));
  }

  remove(item: Pc): Observable<any> {
    const url = `${environment.apiUrl}/api/pc/${item.id}`;
    return this.httpClient.post(url, '');
  }
}

interface GetResponsePCs {
  _embedded: {
    pcs: Pc[];
  };
  pcs: Pc[];
  page: Page;
}

