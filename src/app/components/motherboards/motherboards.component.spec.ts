import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherboardsComponent } from './motherboards.component';

describe('MotherboardsComponent', () => {
  let component: MotherboardsComponent;
  let fixture: ComponentFixture<MotherboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotherboardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotherboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
