import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatagridModule } from 'ng-xui/datagrid';

import { DemoDatagridRoutingModule } from './demo-datagrid.routing';
import { DemoDatagridBasicComponent } from './basic/demo-basic.component';
import { MainContainerComponent } from '../main-container.component';
import { DemoFixedHeaderComponent } from './fixed-header/demo-fixed-header.component';

@NgModule({
    declarations: [
        MainContainerComponent,
        DemoFixedHeaderComponent,
        DemoDatagridBasicComponent
    ],
    imports: [
        CommonModule,
        DatagridModule,
        DemoDatagridRoutingModule
    ],
    exports: [],
    providers: [],
})
export class DatagridDemoModule {}
