import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavbarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create navbar component', () => {
        expect(component).toBeTruthy();
    });

    it('should have navbar link with "EUR - USD Details"', () => {
        const navbar: HTMLElement = fixture.nativeElement;
        const element = navbar.querySelector('li');
        // console.log(element);
        expect(element?.textContent).toContain('EUR - USD Details');
    });

    it('should have navbar link with "EUR - GBP Details"', () => {
        const navbar: HTMLElement = fixture.nativeElement;
        const element = navbar.querySelector('li:nth-child(2)');
        // console.log(element);
        expect(element?.textContent).toContain('EUR - GBP Details');
    });
});
