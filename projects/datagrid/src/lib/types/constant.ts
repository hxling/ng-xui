/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-29 11:40:52
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

import { InjectionToken } from '@angular/core';
export const GRID_EDITORS = new InjectionToken('Farris DataGrid Editors.');
export const GRID_VALIDATORS = new InjectionToken('Farris DataGrid Validators.');

export const SCROLL_Y_ACTION = 'psScrollY';
export const SCROLL_X_ACTION = 'psScrollX';
export const SCROLL_UP_ACTION = 'psScrollUp';
export const SCROLL_DOWN_ACTION = 'psScrollDown';
export const SCROLL_LEFT_ACTION = 'psScrollLeft';
export const SCROLL_RIGHT_ACTION = 'psScrollRight';
export const SCROLL_Y_REACH_END_ACTION = 'psYReachEnd';
export const SCROLL_Y_REACH_START_ACTION = 'psYReachStart';
export const SCROLL_X_REACH_END_ACTION = 'psXReachEnd';
export const SCROLL_X_REACH_START_ACTION = 'psXReachStart';

/** 左侧固定列阴影样式名称 */
export const FIXED_LEFT_SHADOW_CLS = 'l-shadow';
export const FIXED_RIGHT_SHADOW_CLS = 'r-shadow';

export const ROW_HOVER_CLS = 'xui-datagrid-row-hover';

export const ROW_SELECTED_CLS = 'xui-datagrid-row-selected';

export const CELL_SELECTED_CLS = 'xui-datagrid-cell-selected';

/** 行高尺寸定义 */
export const SIZE_TYPE = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 60
};
