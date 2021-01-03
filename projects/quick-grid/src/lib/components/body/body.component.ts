import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GridOptionsManager } from './../../core/services/grid-options.manager';
import { QuickGridColumn } from '../../types/quick-column';

@Component({
    selector: 'grid-body',
    templateUrl: './body.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickGridBodyComponent implements OnInit {
    @Input() columns: QuickGridColumn[];
    @Input() rows = [];
    @Input() width: number;
    @Input() height: number;
    @Input() startIndex = 0;

    convasHeight = 0;
    gridOptions;
    constructor(private gridOptionsMgr: GridOptionsManager) {
    }

    ngOnInit(): void {
        this.gridOptions = this.gridOptionsMgr.gridOption;
    }

    trackByFn = (index, item) => {
        return item[this.gridOptions.idField];
    }
}
