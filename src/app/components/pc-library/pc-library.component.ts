import {Component, OnInit} from '@angular/core';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {Router} from '@angular/router';
import {GpuService} from '../../services/gpu/gpu.service';
import {finalize, take} from 'rxjs/operators';
import {Pc} from '../../entities/pc/pc/pc';
import {PcService} from '../../services/pc/pc.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-pc-library',
  templateUrl: './pc-library.component.html',
  styleUrls: ['./pc-library.component.css']
})
export class PcLibraryComponent implements OnInit {


  item: Pc;
  thePageNumber = 1;
  thePageSize = 7;
  theTotalElements = 0;
  searchMode = false;
  previousKeyword: string = null;
  value = '';
  items: Pc[] = [];
  procSubscription: Subscription;

  mbLink: string;
  gpusLink: string;
  ramLink: string;
  cpuLink: string;
  psLink: string;

  constructor(private router: Router,
              private itemService: PcService) {
  }

  ngOnInit(): void {
    this.listItems();
  }

  listItems(): void {
    this.searchMode = !!this.value;

    if (this.searchMode) {
      this.handleSearchItems();
    } else {
      this.handleItems();
    }
  }

  private handleItems(): void {
    this.itemService
      .getItems(this.thePageNumber, this.thePageSize)
      .pipe(take(1))
      .subscribe(data => {
        this.theTotalElements = data.page.totalElements;
        this.items = data.pcs;
      });
  }

  private handleSearchItems(): void {
    const theKeyword: string = this.value;
    if (this.previousKeyword !== theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    this.itemService.findItems(
      this.thePageNumber,
      this.thePageSize,
      theKeyword)
      .pipe(take(1))
      .subscribe(data => {
        this.items = data._embedded.pcs;
        this.theTotalElements = data.page.totalElements;
      });
  }

  doSearch(value: string): void {
    this.value = value;
    this.listItems();
  }

  goToItem(name: string, link: string): void {
    const path = link + name;
    this.router.navigate([path]);
  }

  remove(item: Pc): void {
    if (confirm('Are you sure you want to remove your PC assembly?')) {
      this.itemService.remove(item)
        .pipe(
          finalize(() => {
            this.listItems();
          })
        )
        .subscribe(
          () => {

          }
        );
    }
  }
}
