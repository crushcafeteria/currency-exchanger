import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry, startWith, tap } from 'rxjs/operators';
import { settings } from '../settings';
import { historical_EUR_USD } from '../spec-helper/FixerAPIMockResponses';
import { CacheResolverService } from './cache-resolver.service';
import * as moment from 'moment';

const httpOptions = {
    headers: new HttpHeaders({ apiKey: settings.API_KEY }),
};

@Injectable({
    providedIn: 'root',
})
export class FixerAPIService {
    constructor(
        private http: HttpClient,
        private cache: CacheResolverService
    ) {}

    // Get all available symbols from API
    getAllCurrencies() {
        const url = `${settings.API_URL}/symbols`;
        const cacheKey = `cache_currency_symbols`;

        if (this.cache.get(cacheKey)) {
            return of(this.cache.get(cacheKey));
        } else {
            const res = this.http.get<any>(url, httpOptions);
            res.subscribe((res) => {
                this.cache.set(cacheKey, res);
            });
            return res;
        }
    }

    // convert currency pair
    convertCurrencyPair(from: string, to: string, amount: number) {
        const url = `${settings.API_URL}/convert?to=${to}&from=${from}&amount=${amount}`;
        const cacheKey = `cache_convert_${from}_${to}_${amount}`;

        if (this.cache.get(cacheKey)) {
            return of(this.cache.get(cacheKey));
        } else {
            const res = this.http.get<any>(url, httpOptions);
            res.subscribe((res) => {
                this.cache.set(cacheKey, res);
            });
            return res;
        }
    }

    // Get latest exchange rates
    latestPopularRates(base: string, symbols: any) {
        const currencies = symbols.join(',');
        const url = `${settings.API_URL}/latest?base=${base}&symbols=${currencies}`;
        const cacheKey = `cache_popular_${base}`;

        if (this.cache.get(cacheKey)) {
            return of(this.cache.get(cacheKey));
        } else {
            const res = this.http.get<any>(url, httpOptions);
            res.subscribe((res) => {
                this.cache.set(cacheKey, res);
            });
            return res;
        }
    }

    getHistoricalData(base: string, symbol: string) {
        const startDate = moment().subtract(12, 'months').format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');
        const url = `${settings.API_URL}/timeseries?start_date=${startDate}&end_date=${endDate}&base=${base}&symbols=${symbol}`;
        const cacheKey = `cache_${base}_${symbol}_history`;

        if (this.cache.get(cacheKey)) {
            return of(this.cache.get(cacheKey));
        } else {
            const res = this.http.get<any>(url, httpOptions);
            res.subscribe((res) => {
                this.cache.set(cacheKey, res);
            });
            return res;
        }
    }
}
