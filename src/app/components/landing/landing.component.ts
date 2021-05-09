import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {ActivatedRoute} from '@angular/router';
import {GpuService} from '../../services/gpu/gpu.service';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
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

  onSubmit($event): void {
    this.resetAll();

    if ($event.submitter.id === 'fix_button') {
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

    } else if ($event.submitter.id === 'check_compatibility_button') {
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
  }

  resetAll(): void {
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

  resetAllWithFixButton(): void {
    // this.resetAll();
    this.isCompatible = null;
  }
}
