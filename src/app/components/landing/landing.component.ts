import {Component, OnDestroy, OnInit} from '@angular/core';
import {of, Subject, Subscription} from 'rxjs';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {ActivatedRoute} from '@angular/router';
import {GpuService} from '../../services/gpu/gpu.service';
import {catchError, debounceTime, distinctUntilChanged, finalize, switchMap, tap} from 'rxjs/operators';
import {AuthService} from '../../services/auth/auth.service';
import {PowerSupplyService} from '../../services/power-supply/power-supply.service';
import {PowerSupply} from '../../entities/pc/powersupply/power-supply';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute,
              private gpuService: GpuService,
              private powerSupplyService: PowerSupplyService,
              private authService: AuthService) {
  }

  gpus: Gpu[] = [];
  powerSupplies: PowerSupply[] = [];

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
  powerSupplySearchSubscription: Subscription;

  ngOnInit(): void {
    this.searchGpus();
    this.searchPowerSupplies();
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
            console.log(results);
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

  ngOnDestroy(): void {
    if (this.powerSupplySearchSubscription) {
      this.powerSupplySearchSubscription.unsubscribe();
    }
    if (this.gpuSearchSubscription) {
      this.gpuSearchSubscription.unsubscribe();
    }


  }

  onPSSearchTermChange(): void {
    this.powerSupplyLoading = true;
  }

  onGpuSearchTermChange(): void {
    this.gpuLoading = true;
  }

  onChange(): void {
    this.gpus = [];
  }

  compareGpus(): boolean {
    return false;
  }

  logout(): void {
    this.authService.logout();
  }
}
