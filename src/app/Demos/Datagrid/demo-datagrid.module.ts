import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DatagridModule } from 'ng-xui/datagrid';

import { DemoDatagridRoutingModule } from './demo-datagrid.routing';
import { DemoDatagridBasicComponent } from './basic/demo-basic.component';
import { MainContainerComponent } from '../main-container.component';
import { DemoDatagridSelectComponent } from './select/demo-select.component';
import { DemoDatagridBorderedComponent } from './bordered/demo-bordered.component';
import { DemoPanelComponent } from '../panel/panel.component';
import { DemoMultiSelectComponent } from './multi-select/demo-multi-select.component';
import { DemoPaginationComponent } from './pagination/demo-pagination.component';

@NgModule({
    declarations: [
        DemoPanelComponent,
        MainContainerComponent,
        DemoDatagridSelectComponent,
        DemoDatagridBasicComponent,
        DemoDatagridBorderedComponent,
        DemoMultiSelectComponent,
        DemoPaginationComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DatagridModule,
        DemoDatagridRoutingModule
    ],
    exports: [],
    providers: [],
})
export class DatagridDemoModule {}
