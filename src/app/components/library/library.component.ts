import {Component, OnInit} from '@angular/core';
import {Name} from '../../entities/name';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  components: Name[];
  selectedComponent: Name;

  constructor() {
  }

  ngOnInit(): void {
    const name = new Name('GPU-s');
    this.selectedComponent = name;

    this.components = [
      name,
      new Name('Motherboards'),
      new Name('RAM-s'),
      new Name('Processors'),
      new Name('Power Supplies')
    ];
  }
}
