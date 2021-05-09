import {PowerSupply} from '../powersupply/power-supply';
import {Motherboard} from '../motherboard/motherboard';
import {Gpu} from '../gpu/gpu';
import {Processor} from '../processor/processor';
import {Ram} from '../ram/ram';
import {GetPcCompatibilityCheck} from '../../get-pc-compatibility-check/get-pc-compatibility-check';

export class PcCompListDto {
  powerSupplies: PowerSupply[];
  motherboards: Motherboard[];
  gpus: Gpu[];
  processors: Processor[];
  rams: Ram[];
  pcCompatibilityCheckResponseDto: GetPcCompatibilityCheck;

  constructor(powerSupplies: PowerSupply[], motherboards: Motherboard[],
              gpus: Gpu[], processors: Processor[],
              rams: Ram[], pcCompatibilityCheckResponseDto: GetPcCompatibilityCheck) {
    this.powerSupplies = powerSupplies;
    this.motherboards = motherboards;
    this.gpus = gpus;
    this.processors = processors;
    this.rams = rams;
    this.pcCompatibilityCheckResponseDto = pcCompatibilityCheckResponseDto;
  }
}
