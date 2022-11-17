import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverterboxComponent } from './converterbox.component';

describe('ConverterboxComponent', () => {
    let component: ConverterboxComponent;
    let fixture: ComponentFixture<ConverterboxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConverterboxComponent],
            imports: [HttpClientModule],
        }).compileComponents();

        fixture = TestBed.createComponent(ConverterboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create converter panel component', () => {
        expect(component).toBeTruthy();
    });

    it('should have default title "Welcome to Currency Exchanger"', () => {
        expect(component.title).toBe('Welcome to Currency Exchanger');
    });

    it('should have default amount of 1', () => {
        expect(component.amount).toBe(1);
    });

    it('should have default from currency of EUR', () => {
        expect(component.from).toBe('EUR');
    });

    it('should have default to currency of USD', () => {
        expect(component.to).toBe('USD');
    });
});
