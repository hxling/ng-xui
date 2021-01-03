import { BehaviorSubject, Subject } from 'rxjs';
import { GridOptionsManager } from './grid-options.manager';
import { Injectable, Injector, Renderer2 } from "@angular/core";

@Injectable()
export class GridSizeManager {

    resize$ = new BehaviorSubject<any>({});

    private $style;
    private stylesheet
    private columnCssRulesL;
    private columnCssRulesR;
   

    private get gridOption() {
        return this.gridOptionMgr.gridOption;
    }

    constructor(public inject: Injector, private gridOptionMgr: GridOptionsManager,
        private render: Renderer2) {
    }

    setGridContainerSize() {
        const gridOption = this.gridOptionMgr.gridOption;
        if (gridOption.fit) {
            return {
                "width.%": 100,
                "height.%": 100 
            };
        } else {
            return {
                "width.px": gridOption.width || 500,
                "height.px": gridOption.height || 400
            }
        }
    }

    
    private getHeaderHeight() {
        if (this.gridOption.showHeader && this.gridOption.gridHeader) {
            return this.gridOption.gridHeader.nativeElement.getBoundingClientRect().height;
        }
        return 0;
    }

    private getViewportHeight() {
        const gridOption = this.gridOption;
        if (gridOption.container) {

            if (gridOption.fit) {
                const parentEl = gridOption.el.parentElement;
                if (parentEl) {
                    return parentEl.getBoundingClientRect().height -
                            this.getCss(parentEl, 'paddingTop') -
                            this.getCss(parentEl, 'paddingBottom')
                }
            } else {
                return gridOption.height;
            }
        }
        return 0;
    }

    private getViewportWidth() {
        const gridOption = this.gridOption;
        if (gridOption.container) {
            if (gridOption.fit) {
                const parentEl = gridOption.el.parentElement;
                if (parentEl) {
                    return parentEl.getBoundingClientRect().width
                }
            } else {
                return gridOption.width;
            }
        }
        return 0;
    }

    setLayoutSize() {
        const gridOption = this.gridOption;
        const headerHeight = this.getHeaderHeight();
        const viewportH = this.getViewportHeight() - headerHeight;
        const viewportW = this.getViewportWidth();
        gridOption.gridBody.nativeElement.style.top = `${headerHeight}px`;
        gridOption.gridBody.nativeElement.style.height = `${viewportH}px`;
        this.gridOption.viewportH = viewportH;
        this.gridOption.viewportW = viewportW;

        const canvasWidth = this.getCanvasWidth();
        this.gridOption.canvasWidth = canvasWidth;

        if (!this.gridOption.scrollbarDimensions) {
            const scrollbarDimensions = this.measureScrollbar();
            this.gridOptionMgr.updateOptions({ scrollbarDimensions });
        }

        this.viewportHasHScroll();
        return {viewportH, viewportW, canvasWidth};
    }

    viewportHasHScroll() {
        const hasHScroll = this.gridOption.canvasWidth >= this.gridOption.viewportW - this.gridOption.scrollbarDimensions.width;
        this.gridOptionMgr.updateOptions({viewportHasHScroll: hasHScroll});
        return hasHScroll;
    }

    viewportHasVScroll() {
        return this.gridOption.canvasHeight > this.gridOption.viewportH;
    }


    updateCanvasWidth() {
        let centerHeaderWidth = this.gridOption.canvasWidth + 1000;
        if (this.viewportHasVScroll()) {
            centerHeaderWidth += this.gridOption.scrollbarDimensions.width;
        }
        this.resize$.next({centerHeaderWidth});
    }

    
    getCanvasWidth() {
        return this.gridOption.columns.reduce((n,i) => {
            n += i.width;
            return n;
        }, 0);
    }
    
    private getCss(target, attrName){
        return parseFloat(window.getComputedStyle(target)[attrName].replace('px', ''));
    }
    
    private createCssRules() {
        const htmlHead = document.querySelector('head');
        this.$style = document.createElement('style');
        this.render.appendChild(htmlHead, this.$style);

        const uid = this.gridOption.uid;

        var rules = [
            "." + uid + " .quick-grid-group-header-column { left: 1000px; }",
            "." + uid + " .quick-grid-header-column { left: 1000px; }",
            // "." + this.uid + " .slick-top-panel { height:" + options.topPanelHeight + "px; }",
            // "." + this.uid + " .slick-preheader-panel { height:" + options.preHeaderPanelHeight + "px; }",
            "." + uid + " .quick-grid-header-columns { height:" + this.gridOption.headerRowHeight + "px; }",
            "." + uid + " .quick-grid-footerrow-columns { height:" + this.gridOption.footerRowHeight + "px; }",
            "." + uid + " .quick-grid-cell { height:" + this.gridOption.rowHeight + "px; }",
            "." + uid + " .quick-grid-row { height:" + this.gridOption.rowHeight + "px; }"
        ];

        for (var i = 0; i < this.gridOption.columns.length; i++) {
            rules.push("." + uid + " .l" + i + " { }");
            rules.push("." + uid + " .r" + i + " { }");
        }

        this.render.appendChild(this.$style, document.createTextNode(rules.join(" ")));
    }

    private getColumnCssRules(columnIndex: number) {
        if (!this.stylesheet) {
            var sheets = document.styleSheets;
            for (let i = 0; i < sheets.length; i++) {
                if ((sheets[i].ownerNode || sheets[i]['owningElement']) == this.$style) {
                    this.stylesheet = sheets[i];
                    break;
                }
            }

            if (!this.stylesheet) {
                throw new Error("Cannot find stylesheet.");
            }

             // find and cache column CSS rules
             this.columnCssRulesL = [];
             this.columnCssRulesR = [];
             var cssRules = (this.stylesheet.cssRules || this.stylesheet.rules);
             var matches, columnIdx;
             for (let i = 0; i < cssRules.length; i++) {
                 var selector = cssRules[i].selectorText;
                 if (matches = /\.l\d+/.exec(selector)) {
                     columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
                     this.columnCssRulesL[columnIdx] = cssRules[i];
                 } else if (matches = /\.r\d+/.exec(selector)) {
                     columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
                     this.columnCssRulesR[columnIdx] = cssRules[i];
                 }
             }

        }

        return {
            "left": this.columnCssRulesL[columnIndex],
            "right": this.columnCssRulesR[columnIndex]
        }
    }

    applyColumnWidths() {
        let x = 0, w, rule;

        this.createCssRules();
        const canvasWidth = this.getCanvasWidth();
        this.gridOption.columns.forEach((n, i) => {
            w = n.width;
            rule = this.getColumnCssRules(i);

            rule.left.style.left = x + "px";
            // rule.right.style.right = (((options.frozenColumn != -1 && i > options.frozenColumn) ? canvasWidthR : canvasWidthL) - x - w) + "px";
            rule.right.style.right = (canvasWidth - x - w) + "px";

            // If this column is frozen, reset the css left value since the
            // column starts in a new viewport.

            x += this.gridOption.columns[i].width;
            // if (options.frozenColumn == i) {
            //     x = 0;
            // } else {
            //     x += columns[i].width;
            // }
        })
    }

    

    /**
     * 计算当前样式下滚动条的宽度与高度    
     */
    private measureScrollbar() {
        const outerdiv = document.createElement('div');
        outerdiv.style.position = 'absolute';
        outerdiv.style.top = '-10000px';
        outerdiv.style.left = '-10000px';
        outerdiv.style.overflow = 'auto';
        outerdiv.style.width = '100px';
        outerdiv.style.height = '100px';
        document.body.appendChild(outerdiv);

        
        const innerdiv = this.render.createElement('div');
        innerdiv.style.overflow = 'auto';
        innerdiv.style.width = '200px';
        innerdiv.style.height = '200px';

        outerdiv.appendChild(innerdiv);

        const dim = {
            width: outerdiv.offsetWidth - outerdiv.clientWidth,
            height: outerdiv.offsetHeight - outerdiv.clientHeight
        };
        innerdiv.remove();
        outerdiv.remove();
        return dim;
    }
}