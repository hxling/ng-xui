/*
* @Author: 疯狂秀才(Lucas Huang)
* @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-29 17:32:46
* @QQ: 1055818239
* @Version: v0.0.1
*/
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Injector, Inject, forwardRef } from '@angular/core';
import { DataColumn } from '../../types';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridBodyComponent } from './datagrid-body.component';
import ResizeObserver from 'resize-observer-polyfill';
import { IS_GROUP_ROW_FIELD, GROUP_ROW_FIELD, IS_GROUP_FOOTER_ROW_FIELD, GROUP_VISIBLE_FIELD } from '../../services/state';

@Component({
    selector: 'datagrid-rows',
    templateUrl: './datagrid-rows.component.html',
})
export class DatagridRowsComponent implements OnInit, AfterViewInit {

    @Input() startRowIndex: number;
    @Input() data: any;
    @Input() columns: DataColumn[];
    @ViewChild('tableEl', {static: false}) tableEl: ElementRef;


    isGroupRow = IS_GROUP_ROW_FIELD;
    groupRow = GROUP_ROW_FIELD;
    isGroupFooter = IS_GROUP_FOOTER_ROW_FIELD;
    visible = GROUP_VISIBLE_FIELD;

    private ro: ResizeObserver = null;
    public dg: DatagridComponent;
    public dgb: DatagridBodyComponent;
    constructor(
        private cd: ChangeDetectorRef,
        public el: ElementRef, private injector: Injector, private ngZone: NgZone) {
            this.dgb = this.injector.get(DatagridBodyComponent);
            this.dg = this.dgb.dg;
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {

    }

    trackByField(index, item) {
        return item.field;
    }


    toggleGroupRow(row, index, open) {
        row.expanded = open;
        this.setGroupRowsVisible(row, open);
    }

    private setGroupRowsVisible(row, open) {
        if (row.rows) {
            const groupRows = row.rows.filter(n => n[IS_GROUP_ROW_FIELD]);
            const footerRows = row.rows.filter(n => n[IS_GROUP_FOOTER_ROW_FIELD]);

            if (footerRows && footerRows.length) {
                footerRows.forEach(n => {
                    n[this.visible] = open &&  n[this.groupRow].expanded;
                });
            }

            groupRows.forEach(t => {
                t[this.visible] = open && t[this.groupRow].expanded && t[this.groupRow][this.visible];
                this.setGroupRowsVisible(t, open);
            });

            if (!groupRows.length) {
                row.rows.forEach(t => {
                    t[this.visible] = open && t[this.groupRow].expanded && t[this.groupRow][this.visible];
                });
            }
        }
    }
}
