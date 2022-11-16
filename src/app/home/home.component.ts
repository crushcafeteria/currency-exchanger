import { Component, OnInit } from '@angular/core';
import { CacheResolverService } from '../services/cache-resolver.service';
import { FixerAPIService } from '../services/fixer-api.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    amount: any = 1;
    from: string = 'EUR';
    to: string = 'USD';
    popular: string[] = [
        'USD',
        'EUR',
        'JPY',
        'GBP',
        'AUD',
        'CAD',
        'CHF',
        'CNH',
        'HKD',
        'NZD',
    ];
    busy: boolean = false;
    rates = null;

    constructor(
        private fixerAPI: FixerAPIService,
        private cache: CacheResolverService
    ) {}

    ngOnInit(): void {}

    updatePopularPairRates(amount: number) {
        console.log(`Receive amount ${amount} from converter`);
        this.amount = amount;

        const cacheKey = `popular_${this.from}_${amount}`;
        if (this.cache.get(cacheKey)) {
            this.rates = this.cache.get(cacheKey).rates;
        } else {
            this.busy = true;
            this.fixerAPI
                .latestPopularRates(this.from, this.popular)
                .subscribe((res) => {
                    this.rates = res.rates;
                    console.log(res);
                    // this.cache.set(cacheKey, res);
                    this.busy = false;
                });
        }
    }

    calculateRate(rate: any) {
        return rate * this.amount;
    }
}
