/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-22 08:32:56
 * @Company: Inspur
 * @Version: v0.0.1
 */
import { TemplateRef } from '@angular/core';
import { DataFormatter } from 'ng-xui/utils';
import { DatagridValidator } from './datagrid-validator';

export interface CustomStyle {
    cls?: string;
    style?: {
        [key: string]: string;
    };
}


export type MoveDirection = 'left' | 'right' | 'up' | 'down';

export interface DataColumn {
    field: string;
    title: string;
    width: number;
    /** 记录原始定义宽度 */
    originalWidth?: number;
    /** 标题对齐方式 */
    halign?: 'left' | 'center' | 'right';
    /** 文本对齐方式 */
    align?: 'left' | 'center' | 'right';
    formatter?: (value, rowData, rowIndex) => any | DataFormatter;
    styler?: (value, rowData, rowIndex) => CustomStyle;
    left?: number;
    /** 是否固定 */
    fixed?: 'left' | 'right';
    /** 是否显示 */
    hidden?: boolean;

    editor?: GridEditor;
    /** 单元格自定义模板 */
    template?: TemplateRef<any>;
    /** 鼠标移动至单元格后，显示悬浮消息 */
    showTips?: boolean;
    /** True to allow the column can be sorted. */
    sortable?: boolean;
    order?: 'asc' | 'desc';
    sorter?: (r1: any, r2: any) => 0 | 1 | -1;
    /** True to allow the column can be resized. */
    resizable?: boolean;
    rowspan?: number;
    colspan?: number;
    index?: number;
    footer?: GridFooterRow;
    groupFooter?: GridFooterRow;
}

export interface GridEditor {
    type: string;
    options?: any;
    validators?: DatagridValidator[];
}

export interface ColumnGroup {
    /** 左侧固定列总宽度 */
    leftFixedWidth?: number;
    /** 左侧固定列集合 */
    leftFixed?: DataColumn[];
    /** 非固定列集合 */
    normalColumns?: DataColumn[];
    /** 右侧固定列宽度 */
    rightFixedWidth?: number;
    /** 右侧固定列集合 */
    rightFixed?: DataColumn[];
    /** 正常宽度 */
    normalWidth?: number;
    /** 所有列宽度之各 */
    totalWidth?: number;
}

export interface PaginationInfo {
    enable?: boolean;
    pageList?: number[];
    pageSize?: number;
    pageIndex?: number;
    total?: number;
}

export enum CalculationType {

    /** 最大值 */
    max = 0,
    /** 最小值 */
    min,
    /** 求和 */
    sum,
    /** 平均数 */
    average,
    /** 总记录数 */
    count
}

export interface GridFooterRow {
    formatter?: (value, rowData, rowIndex) => any | DataFormatter;
    /** 文本对齐方式 */
    align?: 'left' | 'center' | 'right';
    styler?: (value, rowData, rowIndex) => CustomStyle;
    options?: {
        /** 计算类型 */
        calculationType?: CalculationType,
        text?: string;
    };
}


export const defaultPaginationInfo: PaginationInfo = {
    enable: true,
    pageIndex: 1,
    pageSize: 10
};
