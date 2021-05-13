import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSuppliesComponent } from './power-supplies.component';

describe('PowerSuppliesComponent', () => {
  let component: PowerSuppliesComponent;
  let fixture: ComponentFixture<PowerSuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerSuppliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
