import {PcComponent} from '../pc-component';

export class Motherboard extends PcComponent {
  socket: string;
  maxRam: number;
  ramType: string;
  numRam: number;
  powerPin: string;
  processorPowerPin: string;
  chipset: string;
  formFactor: string;
  m2: boolean;
}
