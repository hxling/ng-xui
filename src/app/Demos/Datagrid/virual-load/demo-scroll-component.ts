import { Component, OnInit } from '@angular/core';
import { DemoDataService, RECORD_COUNT } from '../../data-factory/demo-data-service';
import { DataSeed } from '../../data-factory/data-seed';
import { DATAGRID_REST_SERVICEE, CalculationType } from 'ng-xui/datagrid';

@Component({
    selector: 'demo-scroll',
    templateUrl: './demo-scroll.component.html',
    providers: [
        { provide: RECORD_COUNT, useValue: 200000 },
        {provide: DATAGRID_REST_SERVICEE, useClass: DemoDataService}
    ]
})
export class DemoVirualScrollComponent implements OnInit {
    columns = [];
    items;

    fitColumns = true;

    constructor() {
    }

    ngOnInit(): void {

        const enumData = DataSeed.enumData();
        const enumOpts = { valueField: 'value', textField: 'label', data: enumData };

        this.columns = [
            { field: 'id', width: 100, title: 'ID', footer: {
                options: { text: '合计'},
                formatter: (v, d, i) => {
                    return `<b>${v}</b>`;
                }
            }},
            { field: 'name', width: 130, title: '姓名'},
            { field: 'sex', width: 70, title: '性别' },
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否', formatter: { type: 'boolean', options: { trueText: '已婚', falseText: '未婚' }}},
            { field: 'addr', width: 170, title: '地址' },
            { field: 'company', width: 100, title: '公司'},
            { field: 'nianxin', width: 70, title: '年薪', footer: {
                options: { calculationType: CalculationType.sum},
                formatter: { type: 'number', options: { prefix: '￥', suffix: '元', precision: 2 }}
            }},
            { field: 'zhiwei', width: 100, title: '职位', formatter: {type: 'enum', options: enumOpts} }
        ];
    }
}
