import { Component, OnInit } from '@angular/core';
import {Gpu} from '../../entities/pc/gpu/gpu';
import {ActivatedRoute, Router} from '@angular/router';
import {GpuService} from '../../services/gpu/gpu.service';
import {take} from 'rxjs/operators';
import {Ram} from '../../entities/pc/ram/ram';
import {RamService} from '../../services/ram/ram.service';

@Component({
  selector: 'app-rams',
  templateUrl: './rams.component.html',
  styleUrls: ['./rams.component.css']
})
export class RamsComponent implements OnInit {


  item: Ram;
  thePageNumber = 1;
  thePageSize = 7;
  theTotalElements = 0;
  searchMode = false;
  previousKeyword: string = null;
  value = '';
  items: Ram[] = [];
  pathVarName: string;

  constructor(private router: Router,
              private itemService: RamService,
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
        this.items = data._embedded.rams;
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
        this.items = data._embedded.rams;
        this.theTotalElements = data.page.totalElements;
      });
  }

  doSearch(value: string): void {
    this.value = value;
    this.listItems();
  }
}
