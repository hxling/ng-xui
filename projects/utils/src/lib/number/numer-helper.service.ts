import { Injectable } from '@angular/core';

import { Settings } from './settings';
import formatMoney from './formatMoney';
import formatNumber from './formatNumber';
import unformat from './unformat';

@Injectable({
    providedIn: 'root'
})
export class NumberHelperService {
    constructor() {}

    formatMoney(value, opts: Settings = {}): string {
        if (value !== null && value !== undefined) {
            const suffix = opts.suffix || '';
            return formatMoney(value, opts) + suffix;
        } else {
            return value;
        }
    }

    formatNumber(value, opts: Settings = {}): string {
        if (value) {
            return formatNumber(value, opts);
        } else {
            return value;
        }
    }

    unformat(value ) {
        if (value) {
            return unformat(value);
        } else {
            return value;
        }
    }
}
