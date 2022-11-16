import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class CacheResolverService {
    private cache = new Map<string, [Date, HttpResponse<any>]>();

    constructor() {}

    set(key: any, value: any) {
        localStorage[key] = JSON.stringify(value);
        console.log(`Cache saved: ${key}`);
    }

    get(key: any) {
        const cache = localStorage[key];
        if (cache) {
            console.log(`Cache loaded: ${key}`);
            return JSON.parse(localStorage[key]);
        } else {
            return null;
        }
    }
}
