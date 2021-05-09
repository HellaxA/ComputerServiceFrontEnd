export interface GetPcCompatibilityCheck {
  powerSupplyCompatibilityWithGpuPower: any;
  ramAmountCompatibleWithMotherboard: boolean;
  powerSupplyCompatibleWithMotherboardPower: boolean;
  ramGbAmountCompatibleWithMotherboard: boolean;
  processorCompatibleWithMotherboardSocket: boolean;
  powerSupplyCompatibleWithMotherboardCpuPower: boolean;
  tdpValid: boolean;
  ramTypeCompatibleWithMotherboard: boolean;
}
