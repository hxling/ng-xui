/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-09-02 17:55:57
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-22 08:07:31
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { format, isValid } from 'date-fns';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DateTimeHelperService {
    constructor() {}
    /**
     * @param value 要转换格式的日期
     * @param fmt 格式化字符串
     *
     * 更多的格式化请参考
     * [点我点我](https://date-fns.org/v1.30.1/docs/format)
     */
    formatTo(value: any, fmt: string = 'yyyy-MM-dd') {
        if (!value) {
            return '';
        }

        if (value.indexOf('0001') > -1) {
            return '';
        }

        if (value instanceof Date) {
            return format(value, fmt);
        }

        const d = new Date(value);

        if (isValid(d)) {
            return format(d, fmt);
        } else {
            throw new Error('给定的值不能转换为日期');
        }
    }
}
