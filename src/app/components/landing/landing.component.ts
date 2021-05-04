import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {ActivatedRoute} from '@angular/router';
import {GpuService} from '../../services/gpu/gpu.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  gpuSearchSubscription: Subscription;
  value = '';
  gpus: Gpu[] = [];
  gpu: Gpu = new Gpu('');
  searchTerm$ = new Subject<string>();
  @ViewChild('term') term;
  loading = false;

  constructor(private route: ActivatedRoute,
              private gpuService: GpuService) {
    this.gpuSearchSubscription = this.gpuService.search(this.searchTerm$)
      .subscribe(results => {
        this.gpus = results._embedded.gpus;
      });
  }


  ngOnDestroy(): void {
    if (this.gpuSearchSubscription) {
      this.gpuSearchSubscription.unsubscribe();
    }
  }

  setGpu(gpu: Gpu): void {
    this.gpu = gpu;
    this.gpus = [];
  }

  ngOnInit(): void {
  }
}
