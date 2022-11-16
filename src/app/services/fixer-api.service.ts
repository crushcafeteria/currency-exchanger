import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry, startWith, tap } from 'rxjs/operators';
import { settings } from '../settings';
import { CacheResolverService } from './cache-resolver.service';

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

        const cache = localStorage[btoa(url)];
        if (cache) {
            return of(JSON.parse(cache));
        } else {
            return this.http.get<any>(url, httpOptions);
        }
    }

    // @TODO IMPORTANT! Do not cache this request
    convertCurrencyPair(from: string, to: string, amount: number) {
        const url = `${settings.API_URL}/convert?to=${to}&from=${from}&amount=${amount}`;

        const cache = localStorage[btoa(url)];
        if (cache) {
            return of(JSON.parse(cache));
        } else {
            return this.http.get<any>(url, httpOptions);
        }
    }

    // Get latest exchange rates
    latestPopularRates(base: string, symbols: any) {
        const currencies = symbols.join(',');
        const url = `${settings.API_URL}/latest?base=${base}&symbols=${currencies}`;
        return this.http.get<any>(url, httpOptions);
    }
}
