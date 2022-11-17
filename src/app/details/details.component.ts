import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CacheResolverService } from '../services/cache-resolver.service';
import { FixerAPIService } from '../services/fixer-api.service';
import { settings } from '../settings';
import { Chart } from 'angular-highcharts';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
    currencies: any = [];
    from: string = '';
    to: string = '';
    amount: number = 0;
    chart: any;
    series: any[] = [];

    constructor(
        private cache: CacheResolverService,
        private fixerAPI: FixerAPIService,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Get queryParams
        this.activeRoute.queryParams.subscribe((params) => {
            this.from = params['from'];
            this.to = params['to'];
            this.amount = params['amount'];
        });

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

        setTimeout(() => {
            new Promise<void>((resolve) => {
                console.log('Fetching series');
                this.fetchSeries(this.from, this.to);
                resolve();
            }).then(() => {
                console.log('Drawing chart');
                this.initializeChart(this.from, this.to);
            });
        }, 1000);
    }

    getCurrencyName(symbol: string) {
        return `${this.from} - ${this.currencies[this.from]}`;
    }

    initializeChart(from: string, to: string) {
        // Plot chart
        let chart = this.chartObject(from, to);
        this.chart = chart;
    }

    fetchSeries(from: any, to: any) {
        this.fixerAPI.getHistoricalData(from, to).subscribe((res: any) => {
            // Empty current series
            this.series = [];

            // Extract series data
            Object.entries(res.rates).forEach((row) => {
                const s: any[] = [];
                Object.entries(row).forEach((item: any) => {
                    if (typeof item[1] == 'object') {
                        const tmp = Object.entries(item[1])[0][1];
                        s.push(tmp);
                    } else {
                        // Convert to epoch seconds for x axis
                        const epoch = new Date(item[1]).getTime();
                        s.push(epoch);
                    }
                });

                this.series.push(s);
            });

            // Sort series data in ascending order by date
            this.series.sort(function (a, b) {
                return a[0] - b[0];
            });
        });
    }

    updateChart(data: any) {
        this.fetchSeries(data.from, data.to);
        this.chart = this.chartObject(data.from, data.to);
    }

    private chartObject(from: string, to: string) {
        return new Chart({
            chart: {
                type: 'line',
            },
            title: {
                text: from + ' to ' + to + ' exchange rate over time',
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Time Periods',
                },
            },
            yAxis: {
                title: {
                    text: 'Exchange Rate',
                },
            },
            credits: {
                enabled: false,
            },
            series: [
                {
                    name: to + ' Exchange Rate',
                    type: 'line',
                    data: this.series,
                },
            ],
            legend: {
                enabled: false,
            },
            accessibility: {
                enabled: false,
            },
        });
    }
}
