/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-11-19 11:46:48
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

import { Component, OnInit, Input, Renderer2, ViewChild, ElementRef,
    AfterViewInit, ViewEncapsulation, Injector, Inject, forwardRef, Optional, NgZone } from '@angular/core';
import { DataColumn } from './../../types/data-column';
import { ColumnGroup } from '../../types/data-column';
import { DatagridService } from '../../services/datagrid.service';
import { SCROLL_X_ACTION, FIXED_LEFT_SHADOW_CLS, SCROLL_X_REACH_START_ACTION, FIXED_RIGHT_SHADOW_CLS, SCROLL_X_REACH_END_ACTION } from '../../types/constant';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridHeaderCheckboxComponent } from '../checkbox/datagrid-header-checkbox.component';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import ResizeObserver from 'resize-observer-polyfill';

@Component({
    selector: 'datagrid-header',
    templateUrl: './header.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DatagridHeaderComponent implements OnInit, AfterViewInit {
    @Input() height = 36;
    @Input() columns = [];
    @Input() columnsGroup: ColumnGroup;
    @Input() enableFilter = false;

    @ViewChild('header', {static: false}) header: ElementRef;
    @ViewChild('headerContainer', {static: false}) headerColumnsTable: ElementRef;
    @ViewChild('fixedLeft', {static: false}) fixedLeft: ElementRef;

    private _chkall: DatagridHeaderCheckboxComponent;
    @ViewChild('chkAll', {static: false}) set chkAll(v) {
        this._chkall = v;
    }

    private fixedRight: ElementRef;
    @ViewChild('fixedRight', {static: false}) set fr(val) {
        if (val) {
            this.fixedRight = val;
        }
    }

    private dgs: DatagridService;
    private dfs: DatagridFacadeService;
    private ro: ResizeObserver | null = null;

    groupFieldColumns = [];
    constructor(
        private render2: Renderer2, private injector: Injector,
        @Optional() public dg: DatagridComponent, private ngZone: NgZone ) {
        this.dfs = this.injector.get(DatagridFacadeService);
        this.dgs = this.injector.get(DatagridService);

        this.dgs.scorll$.subscribe((d: any) => {
            if (d.type === SCROLL_X_ACTION) {
                this.render2.setStyle(this.headerColumnsTable.nativeElement,  'transform', `translate3d(-${d.x}px, 0px, 0px)` );
                if ( !this.dg.groupRows) {
                    if (this.fixedLeft) {
                        if (d.x) {
                            this.render2.addClass(this.fixedLeft.nativeElement, FIXED_LEFT_SHADOW_CLS);
                        } else {
                            this.render2.removeClass(this.fixedLeft.nativeElement, FIXED_LEFT_SHADOW_CLS);
                        }
                    }

                    if (this.fixedRight) {
                        this.setFixedColumnPosition();
                    }
                }
            }

            if (d.type === SCROLL_X_REACH_START_ACTION) {
                if (this.fixedLeft) {
                    this.render2.removeClass(this.fixedLeft.nativeElement, FIXED_LEFT_SHADOW_CLS);
                }
            }

            if (d.type === SCROLL_X_REACH_END_ACTION) {
                if (this.fixedRight) {
                    this.render2.removeClass(this.fixedRight.nativeElement, FIXED_RIGHT_SHADOW_CLS);
                }
            }
        });

        this.dgs.showFixedShadow.subscribe(isShow => {
            if (this.fixedRight) {
                this.setFixedColumnPosition(isShow);
            }
        });
    }

    ngOnInit(): void {
        this.dgs.checkedRowsTotalChanged$.subscribe(() => {
            if (this._chkall) {
                const checkedsCount = this.dfs.getCheckeds().length;
                if (this.dfs.isCheckAll() || !checkedsCount) {
                    this._chkall.chk.nativeElement.indeterminate = false;
                } else {
                    this._chkall.chk.nativeElement.indeterminate = true;
                }

                if (!checkedsCount) {
                    this._chkall.checked = false;
                }
            }
        });

        this.dgs.uncheckAll.subscribe(() => {
            if (this._chkall) {
                this._chkall.chk.nativeElement.checked = false;
            }
        });

        this.dgs.checkAll.subscribe(() => {
            if (this._chkall) {
                this._chkall.chk.nativeElement.checked = true;
            }
        });

        this.groupFieldColumns = this.dg.groupField.split(',').map(f => {
            return this.dg.flatColumns.find(n => n.field === f);
        });
        // this.dgs.onDataSourceChange.subscribe(() => {
        //     this._chkall.chk.nativeElement.checked = false;
        // });
    }

    // setHeight() {
    //     const offsetHeight =  Math.max(this.headerColumnsTable.nativeElement.offsetHeight, this.dg.headerHeight);
    //     if (this.height < offsetHeight) {
    //         this.height = offsetHeight;
    //         this.header.nativeElement.style.height = this.height + 'px';
    //     }
    // }

    ngAfterViewInit() {
    }

    isShowShadow() {
        const dgContainerWidth = this.dg.dgContainer.nativeElement.offsetWidth;
        return dgContainerWidth < this.dg.colGroup.totalWidth;

    }

    setFixedColumnPosition(isShow = null) {
        let left = this.dg.dgContainer.nativeElement.offsetWidth - this.columnsGroup.rightFixedWidth;
        const allColsWidth =  this.columnsGroup.normalWidth + this.columnsGroup.leftFixedWidth;

        const show = this.isShowShadow();

        isShow = isShow === null ? show : isShow;

        let method = 'addClass';
        if (!isShow) {
            method = 'removeClass';
            left = allColsWidth;
        }
        this.render2[method](this.fixedRight.nativeElement, FIXED_RIGHT_SHADOW_CLS);
        this.render2.setStyle(this.fixedRight.nativeElement,  'transform', `translate3d(${ left }px, 0px, 0px)` );
    }

    onSortColumnClick(e: MouseEvent, col: DataColumn) {
        if (!col.sortable) {
            return;
        }
        const sortName = this.dg.sortName;
        const sortOrder = this.dg.sortOrder;
        let sortFields = [];
        let sortOrders = [];
        if (sortName) {
            sortFields = sortName.split(',');
            sortOrders = sortOrder.split(',');
        }

        const colOrder = col.order || 'asc';
        let newOrder = colOrder;
        const i = sortFields.findIndex(n => n === col.field);
        if (i >= 0) {
            const _order = sortOrders[i] === 'asc' ? 'desc' : 'asc';
            newOrder = _order;
            if (this.dg.multiSort && newOrder === 'asc') {
                newOrder = undefined;
                sortFields.splice(i, 1);
                sortOrders.splice(i, 1);
            } else {
                sortOrders[i] = _order;
            }

        } else {
            if (this.dg.multiSort) {
                sortFields.push(col.field);
                sortOrders.push(colOrder);
            } else {
                sortFields = [col.field];
                sortOrders = [colOrder];
            }
        }

        col.order = newOrder;

        this.dg.sortName = sortFields.join(',');
        this.dg.sortOrder = sortOrders.join(',');
        this.dfs.setSortInfo(this.dg.sortName, this.dg.sortOrder);

        this.dg.beforeSortColumn(this.dg.sortName, this.dg.sortOrder).subscribe(() => {
            if (this.dg.remoteSort) {
                this.dg.reload(true);
            } else {
                this.dfs.clientSort();
            }
        });

    }

    private refresh() {
        const groupFields = this.groupFieldColumns.map(f => f.field).join(',');
        this.dg.setGroupField(groupFields);
    }

    onDrop($event) {
        console.log($event);
        this.groupFieldColumns.push($event.data);
        this.refresh();
    }

    removeGroupField(col) {
        this.groupFieldColumns = this.groupFieldColumns.filter(c => c.field !== col.field);
        this.refresh();
    }
}
