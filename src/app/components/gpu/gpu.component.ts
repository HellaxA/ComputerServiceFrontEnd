import {Component, OnDestroy, OnInit} from '@angular/core';
import {GpuService} from '../../services/gpu/gpu.service';
import {ActivatedRoute} from '@angular/router';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {Subject, Subscription} from 'rxjs';
@Component({
  selector: 'app-gpu',
  templateUrl: './gpu.component.html',
  styleUrls: ['./gpu.component.css']
})
export class GpuComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute,
              private gpuService: GpuService) {
  }
  gpus: Gpu[] = [];
  gpuLoading = false;
  searchTerm$ = new Subject<string>();
  gpuSearchSubscription: Subscription;

  ngOnInit(): void {
    this.gpuSearchSubscription = this.gpuService.search(this.searchTerm$)
      .subscribe(results => {
        this.gpus = results._embedded.gpus;
      });
  }

  private loadGpus(): void {
    this.gpuLoading = true;
  }

  ngOnDestroy(): void {
  }

  fetchGpuInformation($event): void {
  }
}
