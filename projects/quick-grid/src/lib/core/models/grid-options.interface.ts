import { ElementRef } from '@angular/core';
import { QuickGridColumn } from "../../types/quick-column";

export interface GridOption {
    id: string;
    uid: string;
    idField: string;
    columns?: QuickGridColumn[];
    data?: any;
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number;
    /** 行高 */
    rowHeight: number;
    /** 列头行高 */
    headerRowHeight: number;
    /** 页脚行高 */
    footerRowHeight: number;
    /** 填充父容器 */
    fit: boolean;
    /** 填充列宽 */
    fitColumns: boolean;
    autoHeight: boolean;
    showBorder: boolean;
    showHeader: boolean;

    gridHeader?: ElementRef<any>;
    gridHeaderCenter?: ElementRef<any>;
    container?: ElementRef<any>;
    gridBody?: ElementRef<any>;
    viewportScrollContainer?: ElementRef<any>;
    el: any; // HTML element
    canvasWidth?: number;
    canvasHeight?: number;
    viewportH?: number;
    viewportW?: number;
    scrollbarDimensions?: any; // 滚动条尺寸
}