import { TemplateRef } from '@angular/core';

export type TextAlign = 'left' | 'right' | 'center';

export type TextStylerFn = (col: QuickGridColumn) => {};
export type TextStyle = { [styleKey: string]: any };
export type TextStyler = TextStyle | TextStylerFn

export interface QuickGridColumn {
    field: string;
    title: string;
    width: number;
    halign?: TextAlign;
    align?: TextAlign;
    styler?: TextStyler;
    headerTemplate?: TemplateRef<any>;
    dateTemplate?: TemplateRef<any>;
}