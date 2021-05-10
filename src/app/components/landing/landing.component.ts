import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {ActivatedRoute} from '@angular/router';
import {GpuService} from '../../services/gpu/gpu.service';
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {AuthService} from '../../services/auth/auth.service';
import {PowerSupplyService} from '../../services/power-supply/power-supply.service';
import {PowerSupply} from '../../entities/pc/powersupply/power-supply';
import {RamService} from '../../services/ram/ram.service';
import {MotherboardService} from '../../services/motherboard/motherboard.service';
import {ProcessorService} from '../../services/processor/processor.service';
import {Motherboard} from '../../entities/pc/motherboard/motherboard';
import {Ram} from '../../entities/pc/ram/ram';
import {Processor} from '../../entities/pc/processor/processor';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PcService} from '../../services/pc/pc.service';
import {PcIds} from '../../entities/pc/pc/pcIds';
import {GetPcCompatibilityCheck} from '../../entities/get-pc-compatibility-check/get-pc-compatibility-check';
import {Pc} from '../../entities/pc/pc/pc';
import {PcCompListDto} from '../../entities/pc/pc/pc-comp-list-dto';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute,
              private gpuService: GpuService,
              private ramService: RamService,
              private motherboardService: MotherboardService,
              private cpuService: ProcessorService,
              private powerSupplyService: PowerSupplyService,
              private pcService: PcService,
              private formBuilder: FormBuilder,
              private authService: AuthService) {
  }

  gpuMaxPrice = 10000;
  motherboardMaxPrice = 10000;
  cpuMaxPrice = 10000;
  ramMaxPrice = 10000;
  powerSupplyMaxPrice = 10000;

  checkCompatibilityLoading: boolean;
  proposeLoading: boolean;
  checkResponse: GetPcCompatibilityCheck;

  pcCompatibilityForm: FormGroup;

  gpus: Gpu[] = [];
  powerSupplies: PowerSupply[] = [];
  rams: Ram[] = [];
  cpus: Processor[] = [];
  motherboards: Motherboard[] = [];

  ramTypeCompatibleWithMotherboard = '';
  powerSupplyCompatibleWithMotherboardPower = '';
  ramGbAmountCompatibleWithMotherboard = '';
  powerSupplyCompatibleWithMotherboardCpuPower = '';
  processorCompatibleWithMotherboardSocket = '';
  ramAmountCompatibleWithMotherboard = '';
  tdpValid: string;
  gpusResponse = [];

  isCompatible: boolean = null;

  gpuLoading = false;
  ramLoading = false;
  cpuLoading = false;
  motherboardLoading = false;
  powerSupplyLoading = false;
  fixLoading = false;

  gpuSearchTerm$ = new Subject<string>();
  ramSearchTerm$ = new Subject<string>();
  cpuSearchTerm$ = new Subject<string>();
  motherboardTerm$ = new Subject<string>();
  powerSupplyTerm$ = new Subject<string>();

  gpuSearchSubscription: Subscription;
  ramSearchSubscription: Subscription;
  cpuSearchSubscription: Subscription;
  motherboardSearchSubscription: Subscription;
  powerSupplySearchSubscription: Subscription;
  checkCompatibilitySubscription: Subscription;
  fixSubscription: Subscription;

  fixResponse: PcCompListDto;
  proposedComponents: PcCompListDto;

  errorProposal: string;

  ngOnInit(): void {
    this.searchGpus();
    this.searchPowerSupplies();
    this.searchMotherboards();
    this.searchCpus();
    this.searchRams();

    this.pcCompatibilityForm = this.formBuilder.group({
      gpus: new FormControl(null),
      motherboard: new FormControl(null, Validators.required),
      ram: new FormControl(null, Validators.required),
      powerSupply: new FormControl(null, Validators.required),
      processor: new FormControl(null, Validators.required),
      gpusMaxPrice: new FormControl(this.gpuMaxPrice),
      motherboardMaxPrice: new FormControl(this.motherboardMaxPrice),
      ramMaxPrice: new FormControl(this.ramMaxPrice),
      powerSupplyMaxPrice: new FormControl(this.powerSupplyMaxPrice),
      processorMaxPrice: new FormControl(this.cpuMaxPrice),
    });
  }

  searchPowerSupplies(): void {
    this.powerSupplySearchSubscription = this.powerSupplyTerm$
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => this.onPSSearchTermChange()),
        switchMap(term => this.powerSupplyService.searchEntries(term)))
      .subscribe({
        next: (results) => {
          if (results) {
            this.powerSupplies = results._embedded['power-supplies'];
          }
          this.powerSupplyLoading = false;
        }
      });
  }

  searchGpus(): void {
    this.gpuSearchSubscription = this.gpuSearchTerm$
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => this.onGpuSearchTermChange()),
        switchMap(term => this.gpuService.searchEntries(term)))
      .subscribe({
        next: (results) => {
          if (results) {
            this.gpus = results._embedded.gpus;
          }
          this.gpuLoading = false;
        }
      });
  }

  searchMotherboards(): void {
    this.motherboardSearchSubscription = this.motherboardTerm$
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => this.onMotherboardSearchTermChange()),
        switchMap(term => this.motherboardService.searchEntries(term)))
      .subscribe({
        next: (results) => {
          if (results) {
            this.motherboards = results._embedded.motherboards;
          }
          this.motherboardLoading = false;
        }
      });
  }

  searchRams(): void {
    this.ramSearchSubscription = this.ramSearchTerm$
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => this.onRamSearchTermChange()),
        switchMap(term => this.ramService.searchEntries(term)))
      .subscribe({
        next: (results) => {
          if (results) {
            this.rams = results._embedded.rams;
          }
          this.ramLoading = false;
        }
      });
  }

  searchCpus(): void {
    this.cpuSearchSubscription = this.cpuSearchTerm$
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => this.onCPUTermChange()),
        switchMap(term => this.cpuService.searchEntries(term)))
      .subscribe({
        next: (results) => {
          if (results) {
            this.cpus = results._embedded.processors;
          }
          this.cpuLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.powerSupplySearchSubscription) {
      this.powerSupplySearchSubscription.unsubscribe();
    }
    if (this.gpuSearchSubscription) {
      this.gpuSearchSubscription.unsubscribe();
    }
    if (this.motherboardSearchSubscription) {
      this.motherboardSearchSubscription.unsubscribe();
    }
    if (this.ramSearchSubscription) {
      this.ramSearchSubscription.unsubscribe();
    }
    if (this.cpuSearchSubscription) {
      this.cpuSearchSubscription.unsubscribe();
    }
    if (this.checkCompatibilitySubscription) {
      this.checkCompatibilitySubscription.unsubscribe();
    }
    if (this.fixSubscription) {
      this.fixSubscription.unsubscribe();
    }
  }

  onPSSearchTermChange(): void {
    this.powerSupplyLoading = true;
  }

  onGpuSearchTermChange(): void {
    this.gpuLoading = true;
  }

  onRamSearchTermChange(): void {
    this.ramLoading = true;
  }

  onMotherboardSearchTermChange(): void {
    this.motherboardLoading = true;
  }

  onCPUTermChange(): void {
    this.cpuLoading = true;
  }

  compareGpus(): boolean {
    return false;
  }

  logout(): void {
    this.authService.logout();
  }

  get gpusForm(): any {
    return this.pcCompatibilityForm.get('gpus');
  }

  get motherboardForm(): any {
    return this.pcCompatibilityForm.get('motherboard');
  }

  get ramForm(): any {
    return this.pcCompatibilityForm.get('ram');
  }

  get cpuForm(): any {
    return this.pcCompatibilityForm.get('processor');
  }

  get powerSupplyForm(): any {
    return this.pcCompatibilityForm.get('powerSupply');
  }

  get gpusMaxPriceForm(): any {
    return this.pcCompatibilityForm.get('gpusMaxPrice');
  }

  get motherboardMaxPriceForm(): any {
    return this.pcCompatibilityForm.get('motherboardMaxPrice');
  }

  get ramMaxPriceForm(): any {
    return this.pcCompatibilityForm.get('ramMaxPrice');
  }

  get processorMaxPriceForm(): any {
    return this.pcCompatibilityForm.get('processorMaxPrice');
  }

  get powerSupplyMaxPriceForm(): any {
    return this.pcCompatibilityForm.get('powerSupplyMaxPrice');
  }

  onSubmit($event): void {
    this.resetAll();

    if ($event.submitter.id === 'fix_button') {
      this.fix();
    } else if ($event.submitter.id === 'check_compatibility_button') {
      this.checkCompatibility();
    } else if ($event.submitter.id === 'propose_components_button') {
      this.proposeComponents();
    }
  }

  private proposeComponents(): void {
    this.proposeLoading = true;

    const powerSupplyId = this.powerSupplyForm.value?.id;
    const motherboardId = this.motherboardForm.value?.id;
    let gpuIds = [];
    if (this.gpusForm.value) {
      gpuIds = this.gpusForm.value.map(gpu => gpu.id);
    }
    const processorId = this.cpuForm.value?.id;
    const ramId = this.ramForm.value?.id;

    const pcIds = {
      powerSupplyId,
      motherboardId,
      gpuIds,
      processorId,
      ramId
    };

    const maxPrices = {
      motherboardMaxPrice: this.motherboardMaxPriceForm.value,
      gpuMaxPrice: this.gpusMaxPriceForm.value,
      processorMaxPrice: this.processorMaxPriceForm.value,
      ramMaxPrice: this.ramMaxPriceForm.value,
      powerSupplyMaxPrice: this.powerSupplyMaxPriceForm.value
    };

    console.log(maxPrices);

    const pcIdsWithMaxPriceDto = {
      pcRequestDto: pcIds,
      maxPrices
    };

    this.pcService.proposeComponents(pcIdsWithMaxPriceDto)
      .pipe(
        catchError(err => {
          if (err.includes('is not found')) {
            this.errorProposal = err;
          }
          this.proposeLoading = false;
          throw err;
        })
      )
      .subscribe(data => {
        this.proposedComponents = {} as PcCompListDto;
        if (!this.cpuForm.value) {
          this.proposedComponents.processors = data.processors;
        }
        if (!this.gpusForm.value || this.gpusForm.value.length === 0) {
          this.proposedComponents.gpus = data.gpus;
        }
        if (!this.motherboardForm.value) {
          this.proposedComponents.motherboards = data.motherboards;
        }
        if (!this.powerSupplyForm.value) {
          this.proposedComponents.powerSupplies = data.powerSupplies;
        }
        if (!this.ramForm.value) {
          this.proposedComponents.rams = data.rams;
        }
        this.proposedComponents.pcCompatibilityCheckResponseDto = data.pcCompatibilityCheckResponseDto;
        this.proposeLoading = false;
      });
  }

  private fix(): void {
    this.fixLoading = true;
    const pc = new Pc(
      this.powerSupplyForm.value,
      this.motherboardForm.value,
      this.gpusForm.value,
      this.cpuForm.value,
      this.ramForm.value
    );

    this.fixSubscription = this.pcService.fixComputerAssembly(this.checkResponse, pc)
      .subscribe(data => {
        this.fixResponse = data;
        this.fixLoading = false;
        this.isCompatible = null;

        if (!data.pcCompatibilityCheckResponseDto.ramTypeCompatibleWithMotherboard) {
          this.ramTypeCompatibleWithMotherboard = `Sorry, we couldn\'t find the RAM type ` +
            `with the same type of memory(${this.motherboardForm.value.ramType}) as in the motherboard.`;
        }
        if (!data.pcCompatibilityCheckResponseDto.powerSupplyCompatibleWithMotherboardPower) {
          this.powerSupplyCompatibleWithMotherboardPower = `Sorry, we couldn\'t find the power supply ` +
            `with compatible motherboard power pins(${this.motherboardForm.value.powerPin}).`;
        }
        if (!data.pcCompatibilityCheckResponseDto.ramGbAmountCompatibleWithMotherboard) {
          this.ramGbAmountCompatibleWithMotherboard = `Sorry, we couldn\'t find the RAM ` +
            `with the amount of memory <= motherboard maximum (${this.motherboardForm.value.maxRam}).`;
        }
        if (!data.pcCompatibilityCheckResponseDto.powerSupplyCompatibleWithMotherboardCpuPower) {
          this.powerSupplyCompatibleWithMotherboardCpuPower = `Sorry, we couldn\'t find the power supply ` +
            `with compatible motherboard CPU power pins(${this.motherboardForm.value.processorPowerPin}).`;
        }
        if (!data.pcCompatibilityCheckResponseDto.processorCompatibleWithMotherboardSocket) {
          this.processorCompatibleWithMotherboardSocket = `Sorry, we couldn\'t find the processor ` +
            `with the socket (${this.motherboardForm.value.socket}) as in the motherboard.`;
        }
        if (!data.pcCompatibilityCheckResponseDto.ramAmountCompatibleWithMotherboard) {
          this.ramAmountCompatibleWithMotherboard = `Sorry, we couldn\'t find the RAM ` +
            `with the amount of memory sticks <= motherboard max amount (${this.motherboardForm.value.numRam}).`;
        }
        if (!data.pcCompatibilityCheckResponseDto.tdpValid) {
          this.tdpValid = 'Sorry, we couldn\'t find the power supply with enough power for all modules.';
        }
        if (data.pcCompatibilityCheckResponseDto.powerSupplyCompatibilityWithGpuPower && this.gpusForm.value) {
          for (const gpu of this.gpusForm.value) {
            if (data.pcCompatibilityCheckResponseDto.powerSupplyCompatibilityWithGpuPower[gpu.name] !== 'Ok') {
              this.gpusResponse.push(`Sorry, we couldn\'t find the power supply with compatible pins.\n${gpu.name}: ` +
                `${data.pcCompatibilityCheckResponseDto.powerSupplyCompatibilityWithGpuPower[gpu.name]}`);
            }
          }
        }
      });
  }

  private checkCompatibility(): void {
    this.checkCompatibilityLoading = true;
    this.isCompatible = null;

    let gpuIds = [];
    if (this.gpusForm.value) {
      gpuIds = this.gpusForm.value.map(gpu => gpu.id);
    }

    const pcIds = new PcIds(
      this.powerSupplyForm.value.id,
      this.motherboardForm.value.id,
      gpuIds,
      this.cpuForm.value.id,
      this.ramForm.value.id
    );

    this.pcService.checkPcCompatibility(pcIds)
      .subscribe(response => {
        this.checkResponse = response;

        if (!response.ramTypeCompatibleWithMotherboard) {
          this.ramTypeCompatibleWithMotherboard = 'The RAM type is not compatible with a motherboard.';
        }
        if (!response.powerSupplyCompatibleWithMotherboardPower) {
          this.powerSupplyCompatibleWithMotherboardPower = 'The Power supply pins are not compatible with a motherboard.';
        }
        if (!response.ramGbAmountCompatibleWithMotherboard) {
          this.ramGbAmountCompatibleWithMotherboard = 'The RAM GB amount is not compatible with a motherboard.';
        }
        if (!response.powerSupplyCompatibleWithMotherboardCpuPower) {
          this.powerSupplyCompatibleWithMotherboardCpuPower = 'The Power supply pins are not compatible with a motherboard.';
        }
        if (!response.processorCompatibleWithMotherboardSocket) {
          this.processorCompatibleWithMotherboardSocket = 'The processor socket is not compatible with a motherboard socket.';
        }
        if (!response.ramAmountCompatibleWithMotherboard) {
          this.ramAmountCompatibleWithMotherboard = 'The RAM amount is not compatible with a motherboard.';
        }
        if (!response.tdpValid) {
          this.tdpValid = 'Not enough GPU power for all modules.';
        }
        if (response.powerSupplyCompatibilityWithGpuPower && this.gpusForm.value) {
          for (const gpu of this.gpusForm.value) {
            if (response.powerSupplyCompatibilityWithGpuPower[gpu.name] !== 'Ok') {
              this.gpusResponse.push(`${gpu.name}: ${response.powerSupplyCompatibilityWithGpuPower[gpu.name]}`);
            }
          }
        }

        this.isCompatible = response.ramTypeCompatibleWithMotherboard &&
          response.powerSupplyCompatibleWithMotherboardPower &&
          response.ramGbAmountCompatibleWithMotherboard &&
          response.powerSupplyCompatibleWithMotherboardCpuPower &&
          response.processorCompatibleWithMotherboardSocket &&
          response.ramAmountCompatibleWithMotherboard &&
          response.tdpValid &&
          this.gpusResponse.length === 0;

        this.checkCompatibilityLoading = false;
        console.log(response);
      });
  }

  resetAll(): void {
    this.errorProposal = null;
    this.proposedComponents = null;
    this.fixResponse = null;
    this.ramTypeCompatibleWithMotherboard = '';
    this.powerSupplyCompatibleWithMotherboardPower = '';
    this.ramGbAmountCompatibleWithMotherboard = '';
    this.powerSupplyCompatibleWithMotherboardCpuPower = '';
    this.processorCompatibleWithMotherboardSocket = '';
    this.ramAmountCompatibleWithMotherboard = '';
    this.tdpValid = '';
    this.gpusResponse = [];
  }

  resetCpuWithFixButton(): void {
    if (this.cpuForm.value) {
      this.processorMaxPriceForm.disable();
    } else {
      this.processorMaxPriceForm.enable();
    }
    this.processorCompatibleWithMotherboardSocket = '';
    this.resetFixButton();
  }

  resetGpuWithFixButton(): void {
    if (this.gpusForm.value && this.gpusForm.value.length > 0) {
      this.gpusMaxPriceForm.disable();
    } else {
      this.gpusMaxPriceForm.enable();
    }
    if (this.gpusForm.value && this.gpusForm.value.length > 0) {
      this.gpusMaxPriceForm.disable();
    } else {
      this.gpusMaxPriceForm.enable();
    }
    this.resetFixButton();
  }

  resetMBWithFixButton(): void {
    if (this.motherboardForm.value) {
      this.motherboardMaxPriceForm.disable();
    } else {
      this.motherboardMaxPriceForm.enable();
    }
    this.resetFixButton();
  }

  resetPSWithFixButton(): void {
    if (this.powerSupplyForm.value) {
      this.powerSupplyMaxPriceForm.disable();
    } else {
      this.powerSupplyMaxPriceForm.enable();
    }
    this.powerSupplyCompatibleWithMotherboardPower = '';
    this.powerSupplyCompatibleWithMotherboardCpuPower = '';
    this.tdpValid = '';
    this.resetFixButton();
  }

  resetRamWithFixButton(): void {
    if (this.ramForm.value) {
      this.ramMaxPriceForm.disable();
    } else {
      this.ramMaxPriceForm.enable();
    }
    this.ramAmountCompatibleWithMotherboard = '';
    this.ramTypeCompatibleWithMotherboard = '';
    this.ramGbAmountCompatibleWithMotherboard = '';
    this.resetFixButton();
  }

  resetFixButton(): void {
    this.isCompatible = null;
  }

  fullForm(): boolean {
    return this.gpusForm.value && this.gpusForm.value.length > 0 &&
      this.motherboardForm.value && this.ramForm.value &&
      this.cpuForm.value && this.powerSupplyForm.value;
  }

  emptyForm(): boolean {
    return (!this.gpusForm.value || this.gpusForm.value.length === 0) &&
      !this.motherboardForm.value && !this.ramForm.value &&
      !this.cpuForm.value && !this.powerSupplyForm.value;
  }

  setGpuValueRange(): void {
    this.gpuMaxPrice = this.gpusMaxPriceForm.value;
  }

  setMBValueRange(): void {
    this.motherboardMaxPrice = this.motherboardMaxPriceForm.value;
  }

  setRamValueRange(): void {
    this.ramMaxPrice = this.ramMaxPriceForm.value;
  }

  setPSValueChange(): void {
    this.powerSupplyMaxPrice = this.powerSupplyMaxPriceForm.value;
  }

  setCpuValueChange(): void {
    this.cpuMaxPrice = this.processorMaxPriceForm.value;
  }

  setPSMaxPriceFormValue(value: string): void {

    this.powerSupplyMaxPriceForm.setValue(value);
  }

  setCpuMaxPriceFormValue(value: string): void {
    this.processorMaxPriceForm.setValue(value);
  }

  setRamMaxPriceFormValue(value: string): void {
    this.ramMaxPriceForm.setValue(value);
  }

  setGpusMaxPriceFormValue(value: string): void {
    this.gpusMaxPriceForm.setValue(value);
  }

  setMBMaxPriceFormValue(value: string): void {
    this.motherboardMaxPriceForm.setValue(value);
  }

  getNumberFromInputRange(value: string): number {
    return isNaN(+value) ? 5000 : +value;
  }

  setGpuForm(gpu: Gpu): void {
    this.gpusMaxPriceForm.disable();
    let gpus = this.gpusForm.value;
    if (gpus && gpus.length < 2) {
      gpus.push(gpu);
    } else {
      gpus = [gpu];
    }
    this.gpusForm.setValue(gpus);
  }

  setMotherboardForm(motherboard: Motherboard): void {
    this.motherboardMaxPriceForm.disable();
    this.motherboardForm.setValue(motherboard);
  }

  setRamForm(ram: Ram): void {
    this.ramMaxPriceForm.disable();
    this.ramForm.setValue(ram);
  }

  setPSForm(powerSupply: PowerSupply): void {
    this.powerSupplyMaxPriceForm.disable();
    this.powerSupplyForm.setValue(powerSupply);
  }

  setCpuForm(proc: Processor): void {
    this.processorMaxPriceForm.disable();
    this.cpuForm.setValue(proc);
  }
}
