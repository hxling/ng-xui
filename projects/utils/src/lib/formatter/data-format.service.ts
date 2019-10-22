import { Injectable, Injector } from '@angular/core';
import { NumberHelperService } from './../number/numer-helper.service';
import { DateTimeHelperService } from './../datetime/datetime-helper.service';
import { DataFormatter, NumberFormatOptions, EnumFormatOptions, ImageFormatOptions, BooleanFormatOptions } from './formatter-options';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-01-02 14:12:47
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-22 08:48:56
 * @Company: Inspur
 * @Version: v0.0.1
 */
@Injectable({
    providedIn: 'root'
})
export class DataFormatService {
    constructor(private datehelper: DateTimeHelperService, private numberhelper: NumberHelperService) {
    }

    format(value: any, data?: any, formatter?: any) {
        if (formatter) {
            if (typeof(formatter) === 'function') {
                return formatter(value, data);
            } else {
                if (formatter.type) {
                    const fmt = formatter as DataFormatter;
                    switch (fmt.type) {
                        case 'datetime':
                            return this.dateTimeFormat(value, fmt.options.format);
                        case 'number':
                            return this.numberFormat(value, fmt.options);
                        case 'enum':
                            return this.enumFormat(value, fmt.options);
                        case 'image':
                            return this.imageFormat(value, fmt.options);
                        case 'boolean':
                            return this.booleanFormat(value, fmt.options);
                        default:
                            return value;
                    }
                }
            }
        }
        return value;
    }

    private dateTimeFormat(value: any, opts: any) {
        if (value) {
            let fmt = 'yyyy-MM-dd';
            if (typeof(opts) === 'string') {
                fmt = opts;
            } else if (typeof(opts) === 'object') {
                fmt = opts.format;
            }

            return this.datehelper.formatTo(value, fmt);
        }

        return value;
    }

    private numberFormat(value: any, opts?: NumberFormatOptions) {
        if (value !== undefined && value !== '' && !isNaN(value)) {
            return this.numberhelper.formatMoney(value, opts);
        }
        return value;
    }

    private enumFormat(value: any, opts?: EnumFormatOptions) {
        if (value !== undefined && opts) {
            if (opts.data.length) {
                const r = opts.data.find(item  => item[opts.valueField].toString() === value.toString());
                if (r) {
                    return r[opts.textField];
                } else {
                    console.warn(`没有找到值为 ${value} 的标签。`, opts.data);
                    return '';
                }
            }
        }
        return '';
    }

    private imageFormat(value, opts?: ImageFormatOptions) {
        if (value) {
            if (opts) {
                const arrStr = [ `<img src="${value}" `];
                if (opts.width) {
                    arrStr.push(`width="${opts.width}"`);
                }
                if (opts.height) {
                    arrStr.push(`height="${opts.height}"`);
                }

                arrStr.push('>');
                return arrStr.join('');
            } else {
                return `<img src="${value}">`;
            }
        }

        return value;
    }

    private booleanFormat(value, opts?: BooleanFormatOptions) {
        if (value !== undefined) {
            if (opts) {
                return value ? opts.trueText : opts.falseText;
            } else {
                return value;
            }
        }
        return '';
    }
}
