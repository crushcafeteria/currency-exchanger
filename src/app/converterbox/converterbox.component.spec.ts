import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverterboxComponent } from './converterbox.component';

describe('ConverterboxComponent', () => {
  let component: ConverterboxComponent;
  let fixture: ComponentFixture<ConverterboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConverterboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConverterboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
