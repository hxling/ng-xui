import { DemoDataServiceFactory } from './../../data-factory/demo-data-service';
import { Component, OnInit } from '@angular/core';
import { DemoDataService } from '../../data-factory/demo-data-service';

@Component({
    selector: 'demo-row-height',
    templateUrl: './demo-row-height.component.html',
    providers: [
        { provide: DemoDataService, useFactory: DemoDataServiceFactory},
    ]
})
export class DemoRowHeightComponent implements OnInit {
    columns = [];
    items;

    fitColumns = true;

    st = 'md';

    constructor(private dds: DemoDataService) { }

    ngOnInit(): void {
        this.columns = [
            { field: 'id', width: 100, title: 'ID'},
            { field: 'name', width: 130, title: '姓名'},
            { field: 'sex', width: 70, title: '性别' },
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否'},
            { field: 'addr', width: 170, title: '地址' },
            { field: 'company', width: 100, title: '公司'},
            { field: 'nianxin', width: 70, title: '年薪'},
            { field: 'zhiwei', width: 100, title: '职位'}
        ];

        this.items = this.dds.createData(50);
    }
}
