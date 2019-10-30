import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DemoDataService } from '../../data-factory/demo-data-service';
import { DataSeed } from '../../data-factory/data-seed';
import {  CalculationType } from 'ng-xui/datagrid';

@Component({
    selector: 'demo-fixed-columns',
    templateUrl: './demo-fixed-columns.component.html',
    providers: [
        DemoDataService
    ]
})
export class DemoFixedColumnsComponent implements OnInit {
    columns = [];
    items;

    fitColumns = true;

    @ViewChild('cellButtons', {static: true}) btns: TemplateRef<any>;

    constructor(private dds: DemoDataService) { }

    ngOnInit(): void {

        const enumData = DataSeed.enumData();
        const enumOpts = { valueField: 'value', textField: 'label', data: enumData };

        this.columns = [
            { field: 'id', width: 100, title: 'ID', fixed: 'left'},
            { field: 'name', width: 230, title: '姓名', fixed: 'left'},
            { field: 'sex', width: 170, title: '性别' },
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否', formatter: { type: 'boolean', options: { trueText: '已婚', falseText: '未婚' }}},
            { field: 'addr', width: 370, title: '地址' },
            { field: 'company', width: 300, title: '公司'},
            { field: 'nianxin', width: 170, title: '年薪', footer: {
                options: { calculationType: CalculationType.sum},
                formatter: { type: 'number', options: { prefix: '￥', suffix: '元', precision: 2 }}
            }},
            { field: 'zhiwei', width: 100, title: '职位', formatter: {type: 'enum', options: enumOpts} },
            { title: '管理', width: 220, template: this.btns, fixed: 'right', align: 'center' }
        ];

        this.items = this.dds.createData(50);
    }
}
