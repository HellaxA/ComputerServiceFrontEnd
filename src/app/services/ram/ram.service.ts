import { Injectable } from '@angular/core';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {Page} from '../../entities/page/page';
import {Ram} from '../../entities/pc/ram/ram';

@Injectable({
  providedIn: 'root'
})
export class RamService {

  constructor() { }
}
interface GetResponseRams {
  _embedded: {
    rams: Ram[];
  };
  page: Page;
}
