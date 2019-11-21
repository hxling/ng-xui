import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'datagrid', loadChildren: () => import('./demos/datagrid/demo-datagrid.module').then(mod => mod.DatagridDemoModule) },
  { path: 'dnd', loadChildren: () => import('./demos/dnd/demo-dnd.module').then(mod => mod.DemoDnDModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
