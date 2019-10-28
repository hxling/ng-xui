import { DataColumn } from './../../types/data-column';
import { Directive, Input, Injector, Renderer2, ElementRef, OnInit } from '@angular/core';
import { DatagridComponent } from './../../datagrid.component';

@Directive({
    selector: '[footer-styler]',
})
export class DatagridFooterStylerDirective implements OnInit {
    @Input('footer-styler') footerRow;
    @Input() column: DataColumn;
    @Input() index: number;

    constructor(private injector: Injector, private render: Renderer2, private el: ElementRef, private dg: DatagridComponent) {

    }

    ngOnInit() {
        if (this.column && this.column.footer && this.column.footer.styler) {
            const styler = this.column.footer.styler(this.dg.getFieldValue(this.column.field, this.footerRow), this.footerRow, this.index);
            this.dg.renderCustomStyle(styler, this.el.nativeElement);
        }
    }
}
