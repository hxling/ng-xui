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
import { DemoGroupRowsComponent } from './group-rows/demo-group-rows.component';
import { DemoFitComponent } from './fit/demo-fit.component';
import { DemoRowFormatterComponent } from './formatter/demo-row-formatter.component';
import { DemoCellFormatterComponent } from './formatter/demo-cell-formatter.component';
import { DemoDataFormatterComponent } from './formatter/demo-data-formatter.component';
import { DemoTemplateComponent } from './cell-template/demo-template.component';
import { DemoRowHeightComponent } from './row-height/demo-row-height.component';
import { DemoFooterRowComponent } from './footer-row/demo-footer-row.component';
import { DemoSortComponent} from './sort/demo-sort.component';
import { DemoHeaderGroupComponent } from './header-group/demo-header-group.component';
import { DemoFixedColumnsComponent } from './fixed-columns/demo-fixed-columns.component';
import { DemoDataWrapComponent } from './data-wrap/demo-data-wrap.component';
import { DemoLargeDataComponent } from './virual-load/demo-large-data.component';
import { DemoVirualScrollComponent } from './virual-load/demo-scroll-component';

@NgModule({
    declarations: [
        DemoPanelComponent,
        MainContainerComponent,
        DemoDatagridSelectComponent,
        DemoDatagridBasicComponent,
        DemoDatagridBorderedComponent,
        DemoMultiSelectComponent,
        DemoPaginationComponent,
        DemoGroupRowsComponent,
        DemoFitComponent,
        DemoRowFormatterComponent,
        DemoCellFormatterComponent,
        DemoDataFormatterComponent,
        DemoTemplateComponent,
        DemoRowHeightComponent,
        DemoFooterRowComponent,
        DemoSortComponent,
        DemoHeaderGroupComponent,
        DemoFixedColumnsComponent,
        DemoDataWrapComponent,
        DemoLargeDataComponent,
        DemoVirualScrollComponent
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
