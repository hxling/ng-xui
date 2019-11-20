import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoDatagridBasicComponent } from './basic/demo-basic.component';
import { DemoDatagridSelectComponent } from './select/demo-select.component';
import { DemoDatagridBorderedComponent } from './bordered/demo-bordered.component';
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
import { DemoEmptyDataComponent } from './empty-data/demo-empty-data.component';

const routes: Routes = [
    { path: 'basic', component: DemoDatagridBasicComponent },
    { path: 'border', component: DemoDatagridBorderedComponent },
    { path: 'select', component: DemoDatagridSelectComponent },
    { path: 'multi-select', component: DemoMultiSelectComponent },
    { path: 'pager', component: DemoPaginationComponent },
    { path: 'group-rows', component: DemoGroupRowsComponent},
    { path: 'fit', component: DemoFitComponent},
    { path: 'row-formatter', component: DemoRowFormatterComponent},
    { path: 'cell-formatter', component: DemoCellFormatterComponent},
    { path: 'data-formatter', component: DemoDataFormatterComponent},
    { path: 'cell-template', component: DemoTemplateComponent },
    { path: 'row-height', component: DemoRowHeightComponent },
    { path: 'footer-row', component: DemoFooterRowComponent },
    { path: 'sort', component: DemoSortComponent },
    { path: 'header-group', component: DemoHeaderGroupComponent },
    { path: 'fixed-columns', component: DemoFixedColumnsComponent },
    { path: 'wrap', component: DemoDataWrapComponent },
    { path: 'large-data', component: DemoLargeDataComponent },
    { path: 'virual-scroll', component: DemoVirualScrollComponent },
    { path: 'empty', component: DemoEmptyDataComponent},
    { path: '', redirectTo: 'basic'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoDatagridRoutingModule {}
