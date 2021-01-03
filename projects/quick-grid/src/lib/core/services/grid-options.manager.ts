import { GridOption } from '../models/grid-options.interface';
import { Injectable, Injector } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable()
export class GridOptionsManager {

    data$ = new Subject();

    gridOption: GridOption;

    constructor(private inject: Injector) {}

    initOptions(opts: GridOption) {
        this.gridOption = opts;
    }

    updateOptions(val: {[key: string]: any}) {
        this.gridOption = Object.assign(this.gridOption, {...val});
    }

    loadData(data?: any) {
        if (data) {
            this.gridOption.data = data;
        }
        this.data$.next(this.gridOption.data || []);
    }

    clearData() {
        this.gridOption.data = [];
        this.data$.next([]);
    }
}