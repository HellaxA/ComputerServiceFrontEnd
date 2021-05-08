import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PcService {

  constructor(private httpClient: HttpClient) {
  }

  checkPcCompatibility(pc): Observable<GetPcCompatibilityCheck> {
    const url = `${environment.apiUrl}/api/pc/compatibility/check`;
    return this.httpClient.post<GetPcCompatibilityCheck>(url, pc);
  }
}

interface GetPcCompatibilityCheck {
  powerSupplyCompatibilityWithGpuPower: any;
  ramAmountCompatibleWithMotherboard: boolean;
  powerSupplyCompatibleWithMotherboardPower: boolean;
  ramGbAmountCompatibleWithMotherboard: boolean;
  processorCompatibleWithMotherboardSocket: boolean;
  powerSupplyCompatibleWithMotherboardCpuPower: boolean;
  tdpValid: boolean;
  ramTypeCompatibleWithMotherboard: boolean;
}
