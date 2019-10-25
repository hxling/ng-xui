import { Pipe, PipeTransform } from '@angular/core';
import { DatagridFacadeService } from '../services/datagrid-facade.service';

@Pipe({name: 'formatGroupRow'})
export class FormatGroupRowPipe implements PipeTransform {

    constructor(private dfs: DatagridFacadeService) {}

    transform(row: any, fn: any): string {
        if (row && row.value) {
            // const childs = this.dfs.getGroupChilds(row);
            return fn ? fn(row, []) : row.value;
        }

        return '';
    }
}
