import { GridSizeManager } from './grid-size.manager';
import { Injectable, Injector, Renderer2 } from "@angular/core";
import { Subject } from "rxjs";
import { GridOptionsManager } from "./grid-options.manager";

@Injectable()
export class GridService {

    rows$ = new Subject();

    private get gridOption() {
        return this.gridOptionMgr.gridOption;
    }

    private get data() {
        return this.gridOption.data || [];
    }

    private get rowHeight() {
        return this.gridOption.rowHeight;
    }

    private get viewportScrollContainer() {
        return this.gridOption.viewportScrollContainer;
    }

    private rowsCache = {};


    private get viewportH() {
        return this.gridOption.viewportH;
    };
    private get viewportW() {
        return this.gridOption.viewportW;
    }
    scrollTop = 0;
    scrollLeft = 0;
    private prevScrollTop = 0;
    private prevScrollLeft = 0;
    private lastRenderedScrollTop = 0;
    private lastRenderedScrollLeft = 0;

    private minRowBuffer = 3;
    private vScrollDir = 1;

    constructor(public inject: Injector, private gridSizeMgr: GridSizeManager,
        private gridOptionMgr: GridOptionsManager, private render: Renderer2) {
        this.gridOptionMgr.data$.subscribe(data => {
            this.updateRowsCount();
            this.renderRows();
        });
    }

    renderRows() {
        console.time('render rows start.')
       
        let range = this.getRenderedRange();
       
        this.cleanupRows(range);
    
        range = this.getRenderedRange();
        const rowStartIndex = range.top;
        const rows = this.getViewportRows(range);

        this.lastRenderedScrollTop = this.scrollTop;
        this.lastRenderedScrollLeft = this.scrollLeft;

        this.rows$.next({ rows, rowStartIndex, canvasHeight: this.gridOption.canvasHeight });

        console.timeEnd('render rows start.')
    }

    updateRowsCount() {
        const dataLength = this.data && this.data.length || 0;
        let h = dataLength * this.rowHeight;

        const r1 = dataLength - 1;
        const oldH = this.gridOption.canvasHeight;
        for(let i in this.rowsCache) {
            if (parseInt(i, 10) > r1) {
                this.removeRowFromCache(i);
            }
        }
        
        const th = Math.max(h, this.viewportH);
        h = th;

        if (h !== oldH) {
            this.gridOption.canvasHeight = h;
            this.scrollTop = this.viewportScrollContainer.nativeElement.scrollTop;
        }

        const oldScrollTopInRange = (this.scrollTop <= th - this.viewportH);
        if (oldScrollTopInRange) {
            this.scrollTo(this.scrollTop);
        } else {
            // scroll to bottom
            this.scrollTo(th - this.viewportH);
        }
    }

    private scrollTo(y: number) {
        y = Math.max(y, 0);
        var th = this.data.length * this.rowHeight;
        const _viewportHasHScroll = this.gridSizeMgr.viewportHasHScroll();
        y = Math.min(y, th - this.viewportH + ((_viewportHasHScroll) ? this.gridOption.scrollbarDimensions.height : 0));

        // var oldOffset = this.offset;

        // this.page = Math.min(this.n - 1, Math.floor(y / this.canvasHeight));
        // this.offset = Math.round(this.page * this.cj);
        var newScrollTop = y;

        // if (this.offset !== oldOffset) {
        //     const range = this.getVisibleRange(newScrollTop);
        //     this.cleanupRows(range);
        // }

        if (this.prevScrollTop != newScrollTop) {
            this.vScrollDir = (this.prevScrollTop < newScrollTop) ? 1 : -1;
            this.lastRenderedScrollTop = (this.scrollTop = this.prevScrollTop = newScrollTop);
            this.gridOption.viewportScrollContainer.nativeElement.scrollTop = newScrollTop;
        }
    }

    private cleanupRows(rangeToKeep) {
        for (var i in this.rowsCache) {
            if (i < rangeToKeep.top || i > rangeToKeep.bottom) {
                this.removeRowFromCache(i);
            }
        }
    }

    private removeRowFromCache(row?: any) {
        var cacheEntry = this.rowsCache[row];
        if (!cacheEntry) {
            return;
        }
        delete this.rowsCache[row];
    }



    private getRowFromPosition(y) {
        return Math.floor((y ) / this.rowHeight);
    }
    
    private getVisibleRange(viewportTop?: any, viewportLeft?: any) {
        if (viewportTop == null || viewportTop == undefined) {
            viewportTop  = this.scrollTop;
        }

        if (viewportLeft == null || viewportLeft == undefined) {
            viewportLeft = this.scrollLeft;
        }

        return {
            top: this.getRowFromPosition(viewportTop),
            bottom: this.getRowFromPosition(viewportTop + this.viewportH ) + 1,
            leftPx: viewportLeft,
            rightPx: viewportLeft + this.gridOption.width
        }
    }

    private getRenderedRange(viewportTop?:any, viewportLeft?:any) {
        var range = this.getVisibleRange(viewportTop, viewportLeft);
        var buffer = Math.round(this.viewportH / this.rowHeight);
        var minBuffer = this.minRowBuffer;

        if (this.vScrollDir == -1) {
            range.top -= buffer;
            range.bottom += minBuffer;
        } else if (this.vScrollDir == 1) {
            range.top -= minBuffer;
            range.bottom += buffer;
        } else {
            range.top -= minBuffer;
            range.bottom += minBuffer;
        }

        range.top = Math.max(0, range.top);
        range.bottom = Math.min(this.data.length - 1, range.bottom);

        range.leftPx -= this.viewportW;
        range.rightPx += this.viewportW;

        range.leftPx = Math.max(0, range.leftPx);
        range.rightPx = Math.min(this.gridOption.canvasWidth, range.rightPx);

        return range;
    }

    private getViewportRows(range) {
        var stringArrayL = [],
        stringArrayR = [],
        rows = [],
        needToReselectCell = false,
        dataLength = this.data.length;
        for (let i = range.top, ii = range.bottom; i <= ii; i++) {
            if (this.rowsCache[i] || i == dataLength) {
                continue;
            }
            rows.push(i);

            // Create an entry right away so that appendRowHtml() can
            // start populatating it.
            this.rowsCache[i] = {
                "rowNode": null,

                // ColSpans of rendered cells (by column idx).
                // Can also be used for checking whether a cell has been rendered.
                "cellColSpans": [],

                // Cell nodes (by column idx).  Lazy-populated by ensureCellNodesInRowsCache().
                "cellNodesByColumnIdx": [],

                // Column indices of cell nodes that have been rendered, but not yet indexed in
                // cellNodesByColumnIdx.  These are in the same order as cell nodes added at the
                // end of the row.
                "cellRenderQueue": []
            };
        }

        if (rows.length) {
            for (let i = 0, ii = rows.length; i < ii; i++) {
                this.rowsCache[rows[i]].rowNode = this.data[rows[i]];
            }
        }
        return Object.values(this.rowsCache).map((n: any) => n.rowNode);
    }


    _handleScroll() {
        const $viewportScrollContainerY = this.viewportScrollContainer.nativeElement;
        const $viewportScrollContainerX = this.viewportScrollContainer.nativeElement;
        let maxScrollDistanceY = $viewportScrollContainerY.scrollHeight - $viewportScrollContainerY.clientHeight;
        let maxScrollDistanceX = $viewportScrollContainerY.scrollWidth - $viewportScrollContainerY.clientWidth;

        // Protect against erroneous clientHeight/Width greater than scrollHeight/Width.
        // Sometimes seen in Chrome.
        maxScrollDistanceY = Math.max(0, maxScrollDistanceY);
        maxScrollDistanceX = Math.max(0, maxScrollDistanceX);

        // Ceiling the max scroll values
        if (this.scrollTop > maxScrollDistanceY) {
            this.scrollTop = maxScrollDistanceY;
        }
        if (this.scrollLeft > maxScrollDistanceX) {
            this.scrollLeft = maxScrollDistanceX;
        }

        var vScrollDist = Math.abs(this.scrollTop - this.prevScrollTop);
        var hScrollDist = Math.abs(this.scrollLeft - this.prevScrollLeft);

        if (hScrollDist) {
            this.prevScrollLeft = this.scrollLeft;

            const $headerScrollContainer = this.gridOption.gridHeaderCenter.nativeElement;

            $viewportScrollContainerX.scrollLeft = this.scrollLeft;
            $headerScrollContainer.scrollLeft = this.scrollLeft;
            // $topPanelScroller[0].scrollLeft = scrollLeft;
            // $headerRowScrollContainer[0].scrollLeft = scrollLeft;
            // if (options.createFooterRow) {
            //     $footerRowScrollContainer[0].scrollLeft = scrollLeft;
            // }
            // if (options.createPreHeaderPanel) {
            //     if (hasFrozenColumns()) {
            //         $preHeaderPanelScrollerR[0].scrollLeft = scrollLeft;
            //     } else {
            //         $preHeaderPanelScroller[0].scrollLeft = scrollLeft;
            //     }
            // }

            // if (hasFrozenColumns()) {
            //     if (hasFrozenRows) {
            //         $viewportTopR[0].scrollLeft = scrollLeft;
            //     }
            // } else {
            //     if (hasFrozenRows) {
            //         $viewportTopL[0].scrollLeft = scrollLeft;
            //     }
            // }
        }


        if(vScrollDist) {
            this.vScrollDir = this.prevScrollTop < this.scrollTop ? 1 : -1;
            this.prevScrollTop = this.scrollTop;

            // switch virtual pages if needed
            if (vScrollDist < this.viewportH) {
                this.scrollTo(this.scrollTop);
            } else {
                // if (this.canvasHeight == this.viewportH) {
                //     this.page = 0;
                // } else {
                //     this.page = Math.min(this.n - 1, Math.floor(this.scrollTop * ((this.canvasHeight - this.viewportH) / (this.canvasHeight - this.viewportH)) * (1 / this.canvasHeight)));
                // }
                // this.offset = 0;
                // if (oldOffset != this.offset) {
                //     this.removeRowFromCache();
                // }
            }
        }

        if (hScrollDist || vScrollDist) {
            var dx = Math.abs(this.lastRenderedScrollLeft - this.scrollLeft);
            var dy = Math.abs(this.lastRenderedScrollTop - this.scrollTop);

            if (dy > 20) {
                this.renderRows();
            } else {
                debugger;
            }
        }

        if (hScrollDist || vScrollDist) return true;
        return false;

    }

}