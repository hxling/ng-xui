import {isString} from 'lodash-es';

import checkCurrencyFormat from './internal/checkCurrencyFormat';
import {DefaultSettings, Settings } from './settings';
import formatNumber from './formatNumber';
import unformat from './unformat';

/**
 * Format a list of numbers into an accounting column, padding with whitespace
 * to line up currency symbols, thousand separators and decimals places.
 *
 * Returns array of accouting-formatted number strings of same length.
 *
 * NB: `white-space:pre` CSS rule is required on the list container to prevent
 * browsers from collapsing the whitespace in the output strings.
 *
 * **Usage:**
 *
 * ```js
 * formatColumn([123.5, 3456.49, 777888.99, 12345678, -5432], { symbol: "$ " });
 * ```
 *
 * @access public
 * @param list - Array of numbers to format
 * @param opts - Object containing all the options of the method
 * @return Array of accouting-formatted number strings of same length
 */
function formatColumn(list, opts: Settings = {}) {
    if (!list) {
        return [];
    }

    // Build options object from second param (if object) or all params, extending defaults
    opts = Object.assign({},
        DefaultSettings,
        opts
    );

    // Check format (returns object with pos, neg and zero), only need pos for now
    const formats = checkCurrencyFormat(opts.format);

    // Whether to pad at start of string or after currency symbol
    const padAfterSymbol = formats.pos.indexOf('%s') < formats.pos.indexOf('%v');

    // Store value for the length of the longest string in the column
    let maxLength = 0;

    // Format the list according to options, store the length of the longest string
    const formatted = list.map((val) => {
        if (Array.isArray(val)) {
            // Recursively format columns if list is a multi-dimensional array
            return formatColumn(val, opts);
        }
        // Clean up the value
        val = unformat(val, opts.decimal);

        // Choose which format to use for this value (pos, neg or zero)
        let useFormat;

        if (val > 0) {
            useFormat = formats.pos;
        } else if (val < 0) {
            useFormat = formats.neg;
        } else {
            useFormat = formats.zero;
        }

        // Format this value, push into formatted list and save the length
        const fVal = useFormat
            .replace('%s', opts.prefix)
            .replace('%v', formatNumber(Math.abs(val), opts));

        if (fVal.length > maxLength) {
            maxLength = fVal.length;
        }

        return fVal;
    });

    // Pad each number in the list and send back the column of numbers
    return formatted.map((val) => {
        // Only if this is a string (not a nested array, which would have already been padded)
        if (isString(val) && val.length < maxLength) {
            // Depending on symbol position, pad after symbol or at index 0
            return padAfterSymbol ?
                val.replace(opts.prefix, opts.prefix + (new Array(maxLength - val.length + 1).join(' '))) :
                (new Array(maxLength - val.length + 1).join(' ')) + val;
        }
        return val;
    });
}

export default formatColumn;
