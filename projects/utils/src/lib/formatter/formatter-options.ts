
export interface DataFormatter {
    type?: 'datetime' | 'number' | 'enum' | 'image' | 'boolean' ;
    options?: any;
}

export interface NumberFormatOptions {
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
    /** 去掉小数末尾的0 */
    stripZeros?: boolean;
}

export interface DateTimeFormatOptions {
    format?: string;
}

export interface BooleanFormatOptions {
    trueText?: string;
    falseText?: string;
}

export interface EnumFormatOptions {
    valueField: string;
    textField: string;
    data?: any[];
}

export interface ImageFormatOptions {
    width?: string;
    height?: string;
}
