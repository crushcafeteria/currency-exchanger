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

    updatePopularPairRates(data: any) {
        this.amount = data.amount;
        this.busy = true;
        this.fixerAPI
            .latestPopularRates(data.from, this.popular)
            .subscribe((res) => {
                this.rates = res.rates;
                this.busy = false;
            });
    }

    calculateRate(rate: any) {
        return rate * this.amount;
    }
}
