import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from './utils';
import { DataFormatService } from 'ng-xui/utils';

@Pipe({name: 'formatCellData'})
export class FormatCellDataPipe implements PipeTransform {

    constructor(private cfs: DataFormatService) {}

    transform(col: any, rowData: any, groupFooter = false, footer = false): any {
        if (rowData && col && col.field) {
            const value = Utils.getValue(col.field, rowData);
            let formatterFn = col.formatter;
            if (groupFooter) {
                formatterFn = col.groupFooter ? col.groupFooter.formatter : undefined;
            } else if (footer) {
                formatterFn = col.footer ? col.footer.formatter : undefined;
            }

            if (!formatterFn) {
                return value;
            } else {
                return this.cfs.format(value, rowData, formatterFn);
            }
        }

        return '';
    }
}
