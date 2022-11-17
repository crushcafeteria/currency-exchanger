import { TestBed } from '@angular/core/testing';
import { FixerAPIService } from './fixer-api.service';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { settings } from '../settings';
import {
    convertResponse,
    from,
    to,
    amount,
    symbolsResponse,
    latestRatesResponse,
    historical_EUR_USD,
} from '../spec-helper/FixerAPIMockResponses';
import * as moment from 'moment';

const popular: string[] = [
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

describe('FixerAPIService', () => {
    let service: FixerAPIService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [FixerAPIService],
        });
        service = TestBed.inject(FixerAPIService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should create FixerAPI service', () => {
        expect(service).toBeTruthy();
    });

    it('should get all currency symbols', () => {
        service.getAllCurrencies().subscribe((res) => {
            expect(res).toEqual(symbolsResponse);
        });

        const request = httpTestingController.expectOne({
            url: `${settings.API_URL}/symbols`,
            method: 'GET',
        });
        request.flush(symbolsResponse);
    });

    it('should correctly convert 1000 EUR to USD', () => {
        service.convertCurrencyPair(from, to, amount).subscribe((res) => {
            expect(res).toEqual(convertResponse);
        });

        const request = httpTestingController.expectOne({
            url: `${settings.API_URL}/convert?to=${to}&from=${from}&amount=${amount}`,
            method: 'GET',
        });
        request.flush(convertResponse);
    });

    it('should get latest rates for popular currencies', () => {
        service.latestPopularRates(from, popular).subscribe((res) => {
            expect(res).toEqual(latestRatesResponse);
        });

        const request = httpTestingController.expectOne({
            url: `${settings.API_URL}/latest?base=${from}&symbols=${popular}`,
            method: 'GET',
        });
        request.flush(latestRatesResponse);
    });

    it('should get historical data for currency pairs', () => {
        service.getHistoricalData(from, to).subscribe((res) => {
            expect(res).toEqual(historical_EUR_USD);
        });

        const startDate = moment().subtract(12, 'months').format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');
        const request = httpTestingController.expectOne({
            url: `${settings.API_URL}/timeseries?start_date=${startDate}&end_date=${endDate}&base=${from}&symbols=${to}`,
            method: 'GET',
        });
        request.flush(historical_EUR_USD);
    });
});
