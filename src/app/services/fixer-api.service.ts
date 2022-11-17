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
        return this.http.get<any>(url, httpOptions);
    }

    // convert currency pair
    convertCurrencyPair(from: string, to: string, amount: number) {
        const url = `${settings.API_URL}/convert?to=${to}&from=${from}&amount=${amount}`;
        return this.http.get<any>(url, httpOptions);
    }

    // Get latest exchange rates
    latestPopularRates(base: string, symbols: any) {
        const currencies = symbols.join(',');
        const url = `${settings.API_URL}/latest?base=${base}&symbols=${currencies}`;
        return this.http.get<any>(url, httpOptions);
    }

    getHistoricalData(base: string, symbol: string) {
        const startDate = moment().subtract(12, 'months').format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');
        const url = `${settings.API_URL}/timeseries?start_date=${startDate}&end_date=${endDate}&base=${base}&symbols=${symbol}`;
        return this.http.get<any>(url, httpOptions);
    }
}
