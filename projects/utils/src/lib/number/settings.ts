/**
 * The library's settings configuration interface.
 *
 * @typedef DefaultSettings
 * @property symbol - 货币符号
 * @property format - 输出格式t: %s = 货币符号, %v = 值 (can be object, see docs)
 * @property decimal - 小数点分隔符
 * @property thousand - 千分位分隔符
 * @property precision - 保留小数位数
 * @property grouping - 数字分组（尚未实现）
 * @property stripZeros - 去掉小数末尾的0
 * @property fallback - unformat（）失败时返回的值，默认返回0
 * 
 **/
 /**
*  Currency format interface.
 * Each property represents template string used by formatMoney.
 * Inside this template you can use these patterns:
 * - **%s** - Currency symbol
 * - **%v** - Amount
 *
 * **Examples**:
 * ```js
 * '%s %v'   => '$ 1.00'
 * '%s (%v)' => '$ (1.00)'
 * '%s  -- ' => '$  --'
 * ```
 *
 **/
/**
 * The library's default settings configuration object.
 * Contains default parameters for currency and number formatting.
 */
export interface Settings {
    /** 货币符号 */
    prefix?: string;
    /** 后缀符号 */
    suffix?: string;
    /** 输出格式: %s = 货币符号, %v = 值 */
    format?: string;
    /** 小数点分隔符 */
    decimal?: string;
    /** 千分位分隔符 */
    thousand?: string;
    /** 保留小数位数 */
    precision?: number;
    /** 数字分组（尚未实现） */
    grouping?: number;
    /** 去掉小数末尾的0 */
    stripZeros?: boolean;
    /** unformat（）失败时返回的值，默认返回0 */
    fallback?: number;
}


export const DefaultSettings: Settings = {
    prefix: '',
    format: '%s%v',
    decimal: '.',
    thousand: ',',
    precision: 2,
    grouping: 3,
    stripZeros: false,
    fallback: 0
};
