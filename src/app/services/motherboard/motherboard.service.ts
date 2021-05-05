import { Injectable } from '@angular/core';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {Page} from '../../entities/page/page';
import {Motherboard} from '../../entities/pc/motherboard/motherboard';

@Injectable({
  providedIn: 'root'
})
export class MotherboardService {

  constructor() { }
}
interface GetResponseMotherBoards {
  _embedded: {
    motherboards: Motherboard[];
  };
  page: Page;
}
