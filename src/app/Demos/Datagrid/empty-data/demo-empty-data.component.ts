import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
    selector: 'empty-data',
    templateUrl: './demo-empty-data.component.html',
    providers: [
    ]
})
export class DemoEmptyDataComponent implements OnInit {
    items;
    total = 0;
    pageSize = 0;

    dataLength = 5000;

    enabelVirthualRows = true;
    title = 'farris-datagrid';
    columns = [];

    constructor() {}

    ngOnInit() {
        this.columns = [
            { field: 'id', width: 100, title: 'ID' },
            { field: 'name', width: 130, title: '姓名'},
            { field: 'sex', width: 70, title: '性别' },
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否'},
            { field: 'addr', width: 270, title: '地址'},
            { field: 'company', width: 100, title: '公司'},
            { field: 'nianxin', width: 70, title: '年薪'},
            { field: 'zhiwei', width: 100, title: '职位2'},
            { field: 'name2', width: 130, title: '姓名2'},
            { field: 'sex2', width: 70, title: '性别2' },
            { field: 'birthday2', width: 120, title: '出生日期2'},
            { field: 'maray2', width: 70, title: '婚否2'},
            { field: 'addr2', width: 270, title: '地址2'},
            { field: 'company2', width: 100, title: '公司2'},
            { field: 'nianxin2', width: 70, title: '年薪2'},
            { field: 'zhiwei2', width: 100, title: '职位2'}
        ];

    }


}
