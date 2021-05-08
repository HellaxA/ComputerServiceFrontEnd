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

  pcCompatibilityForm: FormGroup;

  gpus: Gpu[] = [];
  powerSupplies: PowerSupply[] = [];
  rams: Ram[] = [];
  cpus: Processor[] = [];
  motherboards: Motherboard[] = [];

  gpuLoading = false;
  ramLoading = false;
  cpuLoading = false;
  motherboardLoading = false;
  powerSupplyLoading = false;

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

  onSubmit(): void {
    console.log(this.cpuForm.value);
  }
}
