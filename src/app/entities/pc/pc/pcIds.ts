export class PcIds {
  powerSupplyId: number;
  motherboardId: number;
  gpuIds: number[];
  processorId: number;
  ramId: number;
  price: number;
  name: string;

  constructor(powerSupplyId: number, motherboardId: number, gpuIds: number[], processorId: number, ramId: number) {
    this.powerSupplyId = powerSupplyId;
    this.motherboardId = motherboardId;
    this.gpuIds = gpuIds;
    this.processorId = processorId;
    this.ramId = ramId;
  }
}
