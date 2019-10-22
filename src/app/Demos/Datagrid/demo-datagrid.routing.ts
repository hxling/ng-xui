import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoDatagridBasicComponent } from './basic/demo-basic.component';
import { DemoFixedHeaderComponent } from './fixed-header/demo-fixed-header.component';


const routes: Routes = [
    { path: 'basic', component: DemoDatagridBasicComponent },
    { path: 'fixed-header', component: DemoFixedHeaderComponent },
    { path: '', redirectTo: 'basic'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoDatagridRoutingModule {}
