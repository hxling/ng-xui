import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DemoDataService } from '../../data-factory/demo-data-service';
import { DATAGRID_REST_SERVICEE, CalculationType } from 'ng-xui/datagrid';

@Component({
    selector: 'demo-group-rows',
    templateUrl: './demo-group-rows.component.html',
    providers: [
        {provide: DATAGRID_REST_SERVICEE, useClass: DemoDataService}
    ]
})
export class DemoGroupRowsComponent implements OnInit {
    items;
    total = 0;
    pageSize = 100;

    dataLength = 5000;
    columns = [];


    showLineNumber = false;
    showCheckbox = false;
    showGroupFooter = false;

    constructor() {}

    ngOnInit() {
        this.columns = [
            { field: 'id', width: 100, title: 'ID', groupFooter: {formatter: this.formatterGroupFooterRow, options: { text: '合计' } } },
            { field: 'name', width: 130, title: '姓名', groupFooter: { options: { calculationType: CalculationType.count } }},
            { field: 'sex', width: 70, title: '性别' },
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否'},
            { field: 'addr', width: 170, title: '地址' },
            { field: 'company', width: 100, title: '公司', groupFooter: { formatter: this.formatterGroupFooterRow, options: { text: '最大值' }}},
            { field: 'nianxin', width: 70, title: '年薪', groupFooter: { options: { calculationType: CalculationType.max }}},
            { field: 'zhiwei', width: 100, title: '职位' }
        ];
    }


    formatterGroupFooterRow = (v, d, i) => {
        return `<b>${v}</b>`;
    }

    groupRowFormatter = (row: any, childs?: any) => {
        if (row.field === 'name') {
            const h = `<b style="color:red">姓名： ${row.value} [${row.total}]</b>`;
            return h;
        } else if (row.field === 'sex') {
            return `<b style="color:blue">性别：${row.value} [${row.total}]</b>`;
        } else {
            return `<b style="color:#886ab5">婚否：${row.value} [${row.total}]</b>`;
        }
    }

    groupRowStyler = (row) => {
        if (row.field === 'name') {
            return {
                style: {
                    background: '#CCE7A4',
                    color: '#5A8129'
                }
            };
        } else if (row.field === 'sex') {
            return {
                style:  {
                    background: '#C0E290',
                    color: '#5A8129'
                }
            };
        } else {
            return {
                style:  {
                    background: '#B5DC7D',
                    color: '#5A8129'
                }
            };
        }
    }
}
