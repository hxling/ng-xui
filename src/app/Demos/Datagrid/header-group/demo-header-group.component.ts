import { Component, OnInit } from '@angular/core';
import { DemoDataService, DemoDataServiceFactory } from '../../data-factory/demo-data-service';
import { DataSeed } from '../../data-factory/data-seed';
import { CalculationType } from 'ng-xui/datagrid';

@Component({
    selector: 'demo-header-group',
    templateUrl: './demo-header-group.component.html',
    providers: [
        {provide: DemoDataService, useFactory: DemoDataServiceFactory}
    ]
})
export class DemoHeaderGroupComponent implements OnInit {
    columns = [];
    items;

    fitColumns = true;

    constructor(private dds: DemoDataService) { }

    ngOnInit(): void {

        const enumData = DataSeed.enumData();
        const enumOpts = { valueField: 'value', textField: 'label', data: enumData };

        this.columns = [
            [
                {title: '基本信息', colspan: 5, halign: 'center'},
                { field: 'addr', width: 170, title: '地址', halign: 'center', rowspan: 3, index: 5 },
                { title: '工作信息', colspan: 3, halign: 'center'}
            ],
            [
                { field: 'id', width: 100, title: 'ID', rowspan: 2, index: 0, footer: {
                    options: { text: '合计'},
                    formatter: (v, d, i) => {
                        return `<b>${v}</b>`;
                    }
                } },
                { field: 'name', width: 130, title: '姓名', rowspan: 2, index: 1, footer: {
                    options: { calculationType: CalculationType.count},
                    formatter: (v, d, i) => {
                        return `<b>共 ${v} 条</b>`;
                    }
                }},
                { title: '自身问题', colspan: 3, halign: 'center'},
                { field: 'company', width: 100, title: '公司', rowspan: 2, index: 6},
                { field: 'nianxin', width: 70, title: '年薪', rowspan: 2 , index: 7, footer: {
                    options: { calculationType: CalculationType.sum},
                    formatter: { type: 'number', options: { prefix: '￥', suffix: '元', precision: 2 }}
                }},
                { field: 'zhiwei', width: 100, title: '职位', rowspan: 2, index: 8 }
            ],
            [
                { field: 'sex', width: 70, title: '性别' , index: 2},
                { field: 'birthday', width: 120, title: '出生日期', index: 3},
                { field: 'maray', width: 70, title: '婚否', index: 4}
            ]
        ];

        this.items = this.dds.createData(50);
    }
}
