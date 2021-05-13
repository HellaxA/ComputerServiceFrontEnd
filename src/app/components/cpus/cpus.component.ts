import { Component, OnInit } from '@angular/core';
import {Processor} from '../../entities/pc/processor/processor';
import {ActivatedRoute, Router} from '@angular/router';
import {ProcessorService} from '../../services/processor/processor.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-cpus',
  templateUrl: './cpus.component.html',
  styleUrls: ['./cpus.component.css']
})
export class CpusComponent implements OnInit {

  item: Processor;
  thePageNumber = 1;
  thePageSize = 7;
  theTotalElements = 0;
  searchMode = false;
  previousKeyword: string = null;
  value = '';
  items: Processor[] = [];
  pathVarName: string;

  constructor(private router: Router,
              private itemService: ProcessorService,
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
        this.items = data._embedded.processors;
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
        this.items = data._embedded.processors;
        this.theTotalElements = data.page.totalElements;
      });
  }

  doSearch(value: string): void {
    this.value = value;
    this.listItems();
  }

}
