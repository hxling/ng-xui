import { Utils } from './../../utils/utils';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-23 08:04:43
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { DatagridComponent } from './../../datagrid.component';
import { Directive, Input, NgZone, OnInit, Renderer2, ElementRef,
        OnDestroy, Inject, forwardRef, ChangeDetectorRef, Injector } from '@angular/core';
import { DatagridBodyComponent } from './datagrid-body.component';

@Directive({
    selector: '[row-hover]',
    exportAs: 'rowHover'
})
export class DatagridRowHoverDirective implements OnInit, OnDestroy {

    @Input() rowIndex: number;
    @Input('row-hover') rowData: any;
    public dg: DatagridComponent;
    public dgb: DatagridBodyComponent;
    constructor(
        private cd: ChangeDetectorRef, private injector: Injector,
        private el: ElementRef, private zone: NgZone, private render: Renderer2) {
            this.dg = this.injector.get(DatagridComponent);
            this.dgb = this.injector.get(DatagridBodyComponent);
    }

    ngOnInit() {
        if (this.dg.rowHover) {
            this.zone.runOutsideAngular( () => {
                Utils.on(this.el.nativeElement, 'mouseenter', this.onmouseenter.bind(this));
                Utils.on(this.el.nativeElement, 'mouseleave', this.onmouseleave.bind(this));
            });
        }
    }

    ngOnDestroy() {
        Utils.off(this.el.nativeElement, 'mouseenter');
        Utils.off(this.el.nativeElement, 'mouseleave');
    }

    onmouseenter() {
        this.setRowHoverCls();
    }

    onmouseleave() {
        this.setRowHoverCls(false);
    }

    setRowHoverCls(hover = true) {
        const leftTableCls = 'xui-datagrid-body-fixed-left';
        const rightTableCls = 'xui-datagrid-body-fixed-right';
        const centerTableCls = 'xui-datagrid-table';

        const leftTableDom = this.dg.el.nativeElement.querySelector(`.${leftTableCls}`);
        const rightTableDom = this.dg.el.nativeElement.querySelector(`.${rightTableCls}`);
        const centerTableDom = this.dg.el.nativeElement.querySelector(`.${centerTableCls}`);

        const method = hover ? 'addClass' : 'removeClass';
        const trSelector = `tr[index="${this.rowIndex}"]`;
        const dom = this.el.nativeElement.closest('div');
        if (dom && dom.className) {

            if (dom.className.indexOf(rightTableCls) > -1) {
                if (leftTableDom) {
                    this.render[method](leftTableDom.querySelector(trSelector), this.dg.hoverRowCls);
                }
                this.render[method](centerTableDom.querySelector(trSelector), this.dg.hoverRowCls);
            } else if (dom.className.indexOf(leftTableCls) > -1) {
                if (rightTableDom) {
                    this.render[method](rightTableDom.querySelector(trSelector), this.dg.hoverRowCls);
                }
                this.render[method](centerTableDom.querySelector(trSelector), this.dg.hoverRowCls);
            } else {
                if (leftTableDom) {
                    this.render[method](leftTableDom.querySelector(trSelector), this.dg.hoverRowCls);
                }
                if (rightTableDom) {
                    this.render[method](rightTableDom.querySelector(trSelector), this.dg.hoverRowCls);
                }
            }
        }
    }

}
