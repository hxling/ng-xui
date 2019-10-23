import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoDatagridBasicComponent } from './basic/demo-basic.component';
import { DemoDatagridSelectComponent } from './select/demo-select.component';
import { DemoDatagridBorderedComponent } from './bordered/demo-bordered.component';
import { DemoMultiSelectComponent } from './multi-select/demo-multi-select.component';
import { DemoPaginationComponent } from './pagination/demo-pagination.component';


const routes: Routes = [
    { path: 'basic', component: DemoDatagridBasicComponent },
    { path: 'border', component: DemoDatagridBorderedComponent },
    { path: 'select', component: DemoDatagridSelectComponent },
    { path: 'multi-select', component: DemoMultiSelectComponent },
    { path: 'pager', component: DemoPaginationComponent },
    { path: '', redirectTo: 'basic'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoDatagridRoutingModule {}
