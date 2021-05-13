import {Component, OnInit} from '@angular/core';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {ActivatedRoute, Router} from '@angular/router';
import {GpuService} from '../../services/gpu/gpu.service';
import {take} from 'rxjs/operators';
import {Motherboard} from '../../entities/pc/motherboard/motherboard';
import {MotherboardService} from '../../services/motherboard/motherboard.service';

@Component({
  selector: 'app-motherboards',
  templateUrl: './motherboards.component.html',
  styleUrls: ['./motherboards.component.css']
})
export class MotherboardsComponent implements OnInit {

  item: Motherboard;
  thePageNumber = 1;
  thePageSize = 7;
  theTotalElements = 0;
  searchMode = false;
  previousKeyword: string = null;
  value = '';
  items: Motherboard[] = [];
  pathVarName: string;

  constructor(private router: Router,
              private itemService: MotherboardService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.pathVarName = this.route.snapshot.paramMap.get('name');
    if (this.pathVarName) {
      this.doSearch(this.pathVarName);
    } else {
      this.listItems();
    }
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
        this.items = data._embedded.motherboards;
        this.theTotalElements = data.page.totalElements;
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
        this.items = data._embedded.motherboards;
        this.theTotalElements = data.page.totalElements;
      });
  }

  doSearch(value: string): void {
    this.value = value;
    this.listItems();
  }

  getBoolean(value): string {
    switch (value) {
      case true:
        return 'Yes';
      case false:
        return 'No';

    }
  }
}
