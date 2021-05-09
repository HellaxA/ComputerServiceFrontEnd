import {GetPcCompatibilityCheck} from '../get-pc-compatibility-check/get-pc-compatibility-check';
import {Pc} from '../pc/pc/pc';

export class PcReqAndResDto {
  pcCompatibilityCheckResponseDto: GetPcCompatibilityCheck;
  pc: Pc;

  constructor(pcCompatibilityCheckResponseDto: GetPcCompatibilityCheck, pc: Pc) {
    this.pcCompatibilityCheckResponseDto = pcCompatibilityCheckResponseDto;
    this.pc = pc;
  }
}
