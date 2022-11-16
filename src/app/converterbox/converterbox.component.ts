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

    @Input() currencies: any = [];
    @Input() amount: number = 1;
    @Input() from: string = 'EUR';
    @Input() to: string = 'USD';
    @Input() result: any = null;
    busy: boolean = false;
    @Input() popular: string[] = [];
    @Output() conversionUpdated = new EventEmitter<number>();

    ngOnInit(): void {
        // Get all available currencies
        if (this.cache.get(settings.CACHE_KEYS.SYMBOLS)) {
            this.currencies = this.cache.get(settings.CACHE_KEYS.SYMBOLS);
        } else {
            this.fixerAPI.getAllCurrencies().subscribe({
                next: (res) => {
                    this.currencies = res.symbols;
                    this.cache.set(settings.CACHE_KEYS.SYMBOLS, res.symbols);
                },
                error: (err) => console.log(err),
                complete: () => console.log('Currency symbols loaded'),
            });
        }
    }

    // Convert currency pair
    convert() {
        if (!this.amount) {
            alert('Please enter an amount');
            return false;
        }

        const cacheKey = `${this.from}_${this.to}_${this.amount}`;
        if (this.cache.get(cacheKey)) {
            this.result = this.cache.get(cacheKey).result;
        } else {
            this.busy = true;
            this.fixerAPI
                .convertCurrencyPair(this.from, this.to, this.amount)
                .subscribe({
                    next: (res) => {
                        this.result = res.result;
                        this.cache.set(cacheKey, res);
                        this.busy = false;
                    },
                    error: (err) => console.log(err),
                    complete: () => console.log('Currency converted'),
                });
        }

        // Signal parent to update popular pairs
        this.conversionUpdated.emit(this.amount);
        return true;
    }
}
