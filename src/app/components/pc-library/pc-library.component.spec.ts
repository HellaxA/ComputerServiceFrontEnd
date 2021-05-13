import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcLibraryComponent } from './pc-library.component';

describe('PcLibraryComponent', () => {
  let component: PcLibraryComponent;
  let fixture: ComponentFixture<PcLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PcLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
