import { Component, OnInit } from '@angular/core';
import { DemoDataService, DemoDataServiceFactory } from '../../data-factory/demo-data-service';
import { DataSeed } from '../../data-factory/data-seed';
import { DATAGRID_REST_SERVICEE, CalculationType } from 'ng-xui/datagrid';

@Component({
    selector: 'demo-cell-formatter',
    templateUrl: './demo-cell-formatter.component.html',
    providers: [
        { provide: DemoDataService, useFactory: DemoDataServiceFactory },
    ]
})
export class DemoCellFormatterComponent implements OnInit {
    columns = [];
    items;

    fitColumns = true;

    constructor(private dds: DemoDataService) { }

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
            }, styler: this.nianXinCellStyler},
            { field: 'zhiwei', width: 100, title: '职位', formatter: {type: 'enum', options: enumOpts} }
        ];

        this.items = this.dds.createData(50);
    }

    nianXinCellStyler = (val, data, index) => {
        if (val) {
            if ( val > 20000 && val < 50000) {
                return {
                    style:  {
                        background: '#F7D2C9',
                        color: '#676F73'
                    }
                };
            } else if (val > 50000 && val < 80000) {
                return {
                    style: {
                        color: '#676F73',
                        background: '#F0A693'
                    }
                };
            } else if (val > 80000) {
                return {
                    style: {
                        color: '#676F73',
                        background: '#EB8870'
                    }
                };
            } else {
                return {
                    style: {
                        color: '#676F73',
                        background: '#D3F5BE'
                    }
                };
            }
        }

        return undefined;
    }
}
