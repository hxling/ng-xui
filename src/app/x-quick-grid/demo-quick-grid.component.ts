import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'demo-quick-grid',
    templateUrl: './demo-quick-grid.component.html',
})
export class DemoQuickGridComponent implements OnInit {
    columns = [];
    _columns = [
        { field: 'id', title:'Id', width: 100 },
        { field: 'title', title:'Title', width: 100 },
        { field: 'duration', title:'Duration', width: 100 },
        { field: 'complete', title:'Complete', width: 100 },
        { field: 'start', title:'Start', width: 100 },
        { field: 'finish', title:'Finish', width: 100 },
        { field: 'effort', title:'Effort', width: 100 },
        { field: 'field_A', title:'field_A', width: 100 },
        { field: 'field_B', title:'field_B', width: 100 },
        { field: 'field_C', title:'field_C', width: 100 },
        { field: 'field_d', title:'field_D', width: 100 },
        { field: 'field_E', title:'field_E', width: 100 },
        { field: 'field_F', title:'field_F', width: 100 },
        { field: 'field_G', title:'field_G', width: 100 },
        { field: 'field_H', title:'field_H', width: 100 },
        { field: 'field_I', title:'field_I', width: 100 },
        { field: 'field_J', title:'field_J', width: 100 },
        { field: 'field_K', title:'field_K', width: 100 },
        { field: 'field_L', title:'field_L', width: 100 },
        { field: 'field_M', title:'field_M', width: 100 },
        { field: 'field_N', title:'field_N', width: 100 },
        { field: 'field_O', title:'field_O', width: 100 },
        { field: 'field_P', title:'field_P', width: 100 },
        { field: 'field_Q', title:'field_Q', width: 100 },
        { field: 'field_R', title:'field_R', width: 100 },
        { field: 'field_S', title:'field_S', width: 100 },
        { field: 'field_T', title:'field_T', width: 100 },
        { field: 'field_U', title:'field_U', width: 100 },
        { field: 'field_V', title:'field_V', width: 100 },
        { field: 'field_W', title:'field_W', width: 100 },
        { field: 'field_X', title:'field_X', width: 100 },
        { field: 'field_Y', title:'field_Y', width: 100 },
        { field: 'field_Z', title:'field_Z', width: 100 }
    ];
    rowsTotal = 100;
    items = [];

    constructor() {
    }
    
    ngOnInit(): void {
        this.onColumnsChanged();
        this.loadData();
    }

    loadData() {
        this.items = this.buildItems(this.rowsTotal);
    }

    createItem(index) {
        return {
            id: index + 1,
            title: 'Task '+ index,
            duration: '5 days',
            complete: Math.floor(Math.random() * 100),
            start: '01/01/2020',
            finish: '01/12/2020',
            effort: index / 2  > 0,
            field_A: 'field_A' + index,
            field_B: 'field_B' + index,
            field_C: 'field_C' + index,
            field_d: 'field_D' + index,
            field_E: 'field_E' + index,
            field_F: 'field_F' + index,
            field_G: 'field_G' + index,
            field_H: 'field_H' + index,
            field_I: 'field_I' + index,
            field_J: 'field_J' + index,
            field_K: 'field_K' + index,
            field_L: 'field_L' + index,
            field_M: 'field_M' + index,
            field_N: 'field_N' + index,
            field_O: 'field_O' + index,
            field_P: 'field_P' + index,
            field_Q: 'field_Q' + index,
            field_R: 'field_R' + index,
            field_S: 'field_S' + index,
            field_T: 'field_T' + index,
            field_U: 'field_U' + index,
            field_V: 'field_V' + index,
            field_W: 'field_W' + index,
            field_X: 'field_X' + index,
            field_Y: 'field_Y' + index,
            field_Z: 'field_Z' + index
        }
    }
    buildItems(count = 500) {
        var i = 0;
        var arr = [];
        while(i <= count - 1) {
            arr.push(this.createItem(i));
            i ++;
        }

        return arr;
    }

    onColumnsChanged(colcount = 5) {
        this.columns = this._columns.slice(0, colcount);
    }
}
