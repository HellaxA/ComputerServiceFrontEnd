import {Motherboard} from '../motherboard/motherboard';
import {PowerSupply} from '../powersupply/power-supply';
import {Gpu} from '../gpu/gpu';
import {Processor} from '../processor/processor';
import {Ram} from '../ram/ram';
import {PcComponent} from '../pc-component';

export class Pc {

  powerSupply: PowerSupply;
  motherboard: Motherboard;
  gpus: Gpu[];
  processor: Processor;
  ram: Ram;
  name: string;
  price: number;
  id: number;

  constructor(powerSupply: PowerSupply, motherboard: Motherboard, gpus: Gpu[], processor: Processor, ram: Ram) {
    this.powerSupply = powerSupply;
    this.motherboard = motherboard;
    this.gpus = gpus;
    this.processor = processor;
    this.ram = ram;
  }
}
