import checkPrecision from './internal/checkPrecision';
import { Settings, DefaultSettings} from './settings';
import { round as precisionRound } from './precision';
/**
 * Implementation of toFixed() that treats floats more like decimals.
 *
 * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
 * problems for accounting- and finance-related software.
 *
 * **Usage:**
 *
 * ```js
 * // Native toFixed has rounding issues
 * (0.615).toFixed(2);
 * // => '0.61'
 *
 * // With accounting-js
 * toFixed(0.615, 2);
 * // => '0.62'
 * ```
 *
 * @access public
 * @param  value - Float to be treated as a decimal number
 * @param  [precision=settings.precision] - Number of decimal digits to keep
 * @param  [round=settings.round] - Decide round direction
 * @return  - Given number transformed into a string with the given precission
 */
function toFixed(value, precision, round?: Number) {
    precision = checkPrecision(precision, DefaultSettings.precision);
    // const power = Math.pow(10, precision);

    // let roundMethod;
    // if (round > 0) {
    //     roundMethod = Math.ceil;
    // } else if (round < 0) {
    //     roundMethod = Math.floor;
    // } else {
    //     roundMethod = Math.round;
    // }

    const precisionValue = precisionRound(value, precision);
    if (Number.isInteger(precisionValue) && precision) {
        // return precisionValue + `.${'0'.repeat(precision)}`;
        const  _precision = ('' + precisionValue).length  + precision;
        return  precisionValue.toPrecision(_precision);
    }
    // Multiply up by precision, round accurately, then divide and use native toFixed()
    return (precisionValue).toFixed(precision);
}

export default toFixed;
