import {PcComponent} from "../pc-component";

export class Gpu extends PcComponent{
  addPower: string;
  tdp: number;
  avgBench: number;

  constructor(name: string) {
    super(name);
  }
}
