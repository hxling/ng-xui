import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoButtonComponent } from './x-button/demo-button.component';
import { DemoQuickGridComponent } from './x-quick-grid/demo-quick-grid.component';


const routes: Routes = [
  { path: 'button', component: DemoButtonComponent },
  { path: 'datagrid', component: DemoQuickGridComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
