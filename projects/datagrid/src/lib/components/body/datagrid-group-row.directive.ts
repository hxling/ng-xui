import { Directive, Input, Injector, Renderer2, ElementRef, OnInit } from '@angular/core';
import { DatagridComponent } from './../../datagrid.component';

@Directive({
    selector: '[group-row]',
})
export class DatagridGroupRowDirective implements OnInit {
    @Input('group-row') groupRow;

    constructor(private injector: Injector, private render: Renderer2, private el: ElementRef, private dg: DatagridComponent) {

    }

    ngOnInit() {
        if (this.dg.groupStyler) {
            const styler = this.dg.groupStyler(this.groupRow);
            this.dg.renderCustomStyle(styler, this.el.nativeElement);
        }
    }
}
