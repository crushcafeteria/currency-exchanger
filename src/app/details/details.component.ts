import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CacheResolverService } from '../services/cache-resolver.service';
import { FixerAPIService } from '../services/fixer-api.service';
import { settings } from '../settings';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';

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
    series: any[] = [];
    busy: boolean = false;

    Highcharts: typeof Highcharts = Highcharts; // required
    chartOptions: Highcharts.Options = this.setChartOptions(this.from, this.to); // required

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
            this.amount = params['amount'] ? params['amount'] : 1;

            // Load initial chart
            this.fetchSeries(this.from, this.to);
        });

        // Get all available currencies
        this.fixerAPI.getAllCurrencies().subscribe({
            next: (res: any) => {
                this.currencies = res.symbols;
                this.cache.set(settings.CACHE_KEYS.SYMBOLS, res.symbols);
            },
            error: (err: any) => console.log(err),
            complete: () => console.log('Currency symbols loaded'),
        });
    }

    getCurrencyName(symbol: string) {
        return `${this.from} - ${this.currencies[this.from]}`;
    }

    fetchSeries(from: any, to: any) {
        this.busy = true;
        this.fixerAPI.getHistoricalData(from, to).subscribe((res: any) => {
            // Empty current series
            this.series = [];

            // Get last days of each month in the past year
            let requiredDates = [];
            let period = 12;
            while (period > 0) {
                let current = moment()
                    .subtract(period, 'months')
                    .endOf('month')
                    .format('YYYY-MM-DD');
                requiredDates.push(current);
                period--;
            }

            // Pick required dates and build chart data
            requiredDates.forEach((date) => {
                const epoch = new Date(date).getTime(); // Convert date to epoch seconds for x axis
                const rate = res.rates[date][to];
                this.series.push([epoch, rate]);
            });

            // Sort chart data by date in ascending order
            this.series.sort(function (a, b) {
                return a[0] - b[0];
            });

            // Update chart
            this.chartOptions.title = {
                text: from + ' to ' + to + ' exchange rate for the past year',
            };
            this.chartOptions.series = [
                {
                    name: to + ' Exchange Rate',
                    type: 'spline',
                    data: this.series,
                },
            ];

            this.busy = false;
        });
    }

    setChartOptions(from: string, to: string) {
        const options: Highcharts.Options = {
            chart: {
                type: 'spline',
            },
            title: {
                text: from + ' to ' + to + ' exchange rate for the past year',
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Months',
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
                    type: 'spline',
                    data: this.series,
                },
            ],
            legend: {
                enabled: false,
            },
            accessibility: {
                enabled: false,
            },
            plotOptions: {
                spline: {
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 4,
                        },
                    },
                    marker: {
                        enabled: false,
                    },
                },
            },
        };
        return options;
    }

    drawChart(data: any) {
        this.fetchSeries(data.from, data.to);
    }
}
