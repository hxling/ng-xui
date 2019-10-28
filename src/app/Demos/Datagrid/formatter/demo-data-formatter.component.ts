import { Component, OnInit } from '@angular/core';
import { DemoDataService } from '../../data-factory/demo-data-service';
import { DataSeed } from '../../data-factory/data-seed';
import { DATAGRID_REST_SERVICEE, CalculationType } from 'ng-xui/datagrid';

@Component({
    selector: 'demo-data-formatter',
    templateUrl: './demo-data-formatter.component.html',
    providers: [
        DemoDataService,
        {provide: DATAGRID_REST_SERVICEE, useClass: DemoDataService}
    ]
})
export class DemoDataFormatterComponent implements OnInit {
    columns = [];
    items;

    fitColumns = true;
    enumData = DataSeed.enumData();
    enumOpts = { valueField: 'value', textField: 'label', data: this.enumData };
    constructor(private dds: DemoDataService) { }

    ngOnInit(): void {

        this.columns = [
            { field: 'id', width: 100, title: 'ID', footer: {
                options: { text: '合计'},
                formatter: (v, d, i) => {
                    return `<b>${v}</b>`;
                }
            }},
            { field: 'name', width: 130, title: '姓名'},
            { field: 'sex', width: 70, title: '性别', formatter: this.customeFieldFormatter },
            { field: 'birthday', width: 120, title: '出生日期',
                formatter: {
                    type: 'datetime',
                    options: {format: 'yyyy年MM月dd日' }
                }
            },
            { field: 'maray', width: 70, title: '婚否', formatter: { type: 'boolean', options: { trueText: '已婚', falseText: '未婚' }}},
            { field: 'addr', width: 170, title: '地址' },
            { field: 'company', width: 100, title: '公司'},
            { field: 'nianxin', width: 170, title: '年薪', footer: {
                    options: { calculationType: CalculationType.sum},
                    formatter: { type: 'number', options: { prefix: '￥', suffix: '元', precision: 2 }}
                },
                formatter: { type: 'number', options: { prefix: '￥', suffix: '元', precision: 2 } }
            },
            { field: 'zhiwei', width: 100, title: '职位', formatter: {type: 'enum', options: this.enumOpts} },
        ];

        this.items = this.dds.createData(50);
    }

    customeFieldFormatter = (val, data) => {
        if (val === '女') {
            return '👩';
        }
        return '👨';
    }

    showImageFormatter = (val, data: any) => {
        return `<img src="assets/rzq/${this.enumData.find(e => e.value === data['zhiwei']).label}.png width=50>`;
    }
}
