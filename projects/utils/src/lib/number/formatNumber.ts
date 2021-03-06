import stripInsignificantZeros from './internal/stripInsignificantZeros';
import {DefaultSettings, Settings } from './settings';
import toFixed from './toFixed';

/**
 * Format a number, with comma-separated thousands and custom precision/decimal places.
 *
 * _Alias_: `format(number, opts)`
 *
 * **Usage:**
 *
 * ```js
 * // Default usage
 * formatNumber(5318008);
 * // => 5,318,008
 *
 * // Custom format
 * formatNumber(9876543.21, { precision: 3, thousand: " " });
 * // => 9 876 543.210
 * ```
 *
 * @access public
 * @param number - Number to be formatted
 * @param opts - Object containing all the options of the method
 * @return Given number properly formatted
 */
function formatNumber(number, opts: Settings = {}) {

    if (number === null || number === undefined || Number.isNaN(number)) {
        return '';
    }

    // Resursively format arrays:
    if (Array.isArray(number)) {
        return number.map(val => formatNumber(val, opts));
    }

    // Build options object from second param (if object) or all params, extending defaults
    opts = Object.assign({}, DefaultSettings, opts);

    // Do some calc
    const negative = number < 0 ? '-' : '';
    const base = parseInt(toFixed(Math.abs(number), opts.precision), 10) + '';
    const mod = base.length > 3 ? base.length % 3 : 0;

    // Format the number
    const formatted =
        negative +
        (mod ? base.substr(0, mod) + opts.thousand : '') +
        base.substr(mod).replace(/(\d{3})(?=\d)/g, '$1' + opts.thousand) +
        (opts.precision > 0
            ? opts.decimal + toFixed(Math.abs(number), opts.precision).split('.')[1]
            : '');

    return opts.stripZeros
        ? stripInsignificantZeros(formatted, opts.decimal)
        : formatted;
}

export default formatNumber;
