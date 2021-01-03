import { QuickGridColumn } from './../../types/quick-column';
import { Component, Input, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
    selector: 'grid-header',
    templateUrl: './header.component.html',
})
export class QuickGridHeaderComponent implements OnInit {

    @Input() columns: QuickGridColumn[];

    constructor(private elRef: ElementRef, private render: Renderer2) { }

    ngOnInit(): void {
    }
}
