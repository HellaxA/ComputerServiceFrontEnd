import { Injectable } from '@angular/core';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {Page} from '../../entities/page/page';
import {Processor} from '../../entities/pc/processor/processor';

@Injectable({
  providedIn: 'root'
})
export class ProcessorService {

  constructor() { }
}
interface GetResponseProcessors {
  _embedded: {
    processors: Processor[];
  };
  page: Page;
}
