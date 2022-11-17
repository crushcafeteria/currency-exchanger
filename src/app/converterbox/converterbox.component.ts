import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CacheResolverService } from '../services/cache-resolver.service';
import { FixerAPIService } from '../services/fixer-api.service';
import { settings } from '../settings';

@Component({
    selector: 'app-converterbox',
    templateUrl: './converterbox.component.html',
    styleUrls: ['./converterbox.component.css'],
})
export class ConverterboxComponent implements OnInit {
    constructor(
        private fixerAPI: FixerAPIService,
        private cache: CacheResolverService
    ) {}

    @Input() title: string = 'Welcome to Currency Exchanger';
    @Input() currencies: any = [];
    @Input() amount: number = 1;
    @Input() from: string = 'EUR';
    @Input() to: string = 'USD';
    @Input() result: any = null;
    busy: boolean = false;
    @Input() popular: string[] = [];
    @Output() conversionUpdated = new EventEmitter();
    rate: number = 0;
    @Input() isDetails: boolean = false;

    ngOnInit(): void {
        // Get all available currencies
        this.fixerAPI.getAllCurrencies().subscribe({
            next: (res: any) => {
                this.currencies = res.symbols;
            },
            error: (err: any) => console.log(err),
            complete: () => console.log('Currency symbols loaded'),
        });

        // Always convert onLoad in details page
        if (this.isDetails) {
            this.convert();
        }
    }

    // Convert currency pair
    convert() {
        if (!this.amount) {
            alert('Please enter an amount');
            return false;
        }

        this.busy = true;
        this.fixerAPI
            .convertCurrencyPair(this.from, this.to, this.amount)
            .subscribe({
                next: (res) => {
                    this.result = res.result;
                    this.rate = res.info.rate;
                    this.busy = false;
                },
                error: (err) => console.log(err),
                complete: () => console.log('Currency successfully converted'),
            });

        // Signal parent to update popular pairs
        this.conversionUpdated.emit({
            from: this.from,
            to: this.to,
            amount: this.amount,
        });
        return true;
    }

    swap() {
        const _from = this.from;
        const _to = this.to;

        this.to = _from;
        this.from = _to;
    }

    // Proxy method
    // Triggers onChange conversion in details page
    convertOnChange() {
        if (this.isDetails) {
            this.convert();
        }
    }
}
