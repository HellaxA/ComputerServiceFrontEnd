import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PcIds} from '../../entities/pc/pc/pcIds';
import {GetPcCompatibilityCheck} from '../../entities/get-pc-compatibility-check/get-pc-compatibility-check';
import {PcReqAndResDto} from '../../entities/pc-req-and-res-dto/pc-req-and-res-dto';
import {Pc} from '../../entities/pc/pc/pc';
import {PcCompListDto} from '../../entities/pc/pc/pc-comp-list-dto';

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
}

