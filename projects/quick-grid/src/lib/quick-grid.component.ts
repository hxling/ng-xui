import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, Renderer2, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { auditTime, debounceTime, map, throttleTime } from 'rxjs/operators';
import { QuickGridColumn } from './types/quick-column';
import { GridService } from './core/services/grid.service';
import { GridOptionsManager } from './core/services/grid-options.manager';
import { GridSizeManager } from './core/services/grid-size.manager';

@Component({
    selector: 'x-quick-grid',
    templateUrl: './quick-grid.component.html',
    styles: [],
    providers: [
        GridOptionsManager,
        GridSizeManager,
        GridService
    ]
})
export class QuickGridComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() debug = false;

    @Input() id = '';
    /** 主键字段 */
    @Input() idField = 'id';
    @Input() columns: QuickGridColumn[];
    @Input() data = [];
    /** 宽度 */
    @Input() width = 500;
    /** 高度 */
    @Input() height = 400;
    /** 行高 */
    @Input() rowHeight = 25;
    /** 列头行高 */
    @Input() headerRowHeight = 27;
    /** 页脚行高 */
    @Input() footerRowHeight = 25;
    /** 填充父容器 */
    @Input() fit = false;
    /** 填充列宽 */
    @Input() fitColumns = false;
    @Input() autoHeight = false;
    @Input() showBorder = true;
    @Input() showHeader = true;


    @ViewChild('header', { static: true }) gridHeader: ElementRef<any>;
    @ViewChild('headerC', { static: true }) gridHeaderCenter: ElementRef<any>;
    @ViewChild('body', { static: true }) gridBody: ElementRef<any>;
    @ViewChild('container', { static: true }) container: ElementRef<any>;
    @ViewChild('viewportScrollContainer', {static: true}) viewportScrollContainer: ElementRef<any>

    uid = 'x-quickgrid_' + Math.round(1000000 * Math.random());
    rows = [];
    gridStyle = {};
    rowStartIndex = 0;
    canvasWidth;
    canvasHeight;

    
    gridOptionMgr: GridOptionsManager;
    gridSizeMgr: GridSizeManager;
    gridService: GridService;
    el: any;
    centerHeaderWidth$: any;
    constructor(public elRef: ElementRef, public render: Renderer2, private inject: Injector) {
        this.gridOptionMgr = this.inject.get(GridOptionsManager);
        this.gridSizeMgr = this.inject.get(GridSizeManager);
        this.gridService = this.inject.get(GridService);
        this.el = this.elRef.nativeElement;

        this.centerHeaderWidth$ = this.gridSizeMgr.resize$.pipe(
            map( (n: any) => n.centerHeaderWidth)
        );

        this.gridService.rows$.subscribe((n: any) => {
            this.rowStartIndex = n.rowStartIndex;
            this.canvasHeight = n.canvasHeight;
            this.rows = n.rows;
            this.gridSizeMgr.updateCanvasWidth();
        });
    }

    ngOnInit(): void {
        this.init();
    }
    
    ngAfterViewInit() {
        this.bindScrollEvent();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.isFirstChange()) {
            this.gridOptionMgr.loadData(changes.data.currentValue);
        }

        if (changes.columns && !changes.columns.isFirstChange()) {
            this.gridOptionMgr.updateOptions({columns: this.columns});
            this.updateColumnSize();
            this.gridSizeMgr.updateCanvasWidth();
        }
    }

    private init() {
        this.createId();
        this.gridOptionMgr.initOptions({...this});
        this.setStyle();
        this.updateColumnSize();
        if (this.data) {
            this.gridOptionMgr.loadData();
        }
    }

    private updateColumnSize() {
        const _size =  this.gridSizeMgr.setLayoutSize();
        this.canvasWidth = _size.canvasWidth;
        this.gridSizeMgr.applyColumnWidths();
    }
    
    private createId() {
        if (!this.id) {
            this.id = 'x-quickgrid_' + Math.round(10000000 * Math.random())
        }
    }

    private setStyle() {
        this.gridStyle = this.gridSizeMgr.setGridContainerSize();
    }

    private bindScrollEvent() {
        fromEvent(this.viewportScrollContainer.nativeElement, 'scroll').pipe(
            debounceTime(10),
            throttleTime(10)
            // auditTime(20)
        ).subscribe(() => {
            this.handleScroll();
        });
    }
    
    private handleScroll() {
        var $viewportScrollContainerY = this.viewportScrollContainer.nativeElement;
        this.gridService.scrollTop = $viewportScrollContainerY.scrollTop;
        this.gridService.scrollLeft = $viewportScrollContainerY.scrollLeft;
        return this.gridService._handleScroll();
    }
}
